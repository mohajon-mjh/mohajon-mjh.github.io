import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  get,
  update
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

window.signup = async function(name,email,password){

  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = cred.user.uid;

  await set(ref(db,"users/"+uid),{
    uid,
    name,
    email,
    role:"customer",
    phone:"",
    avatar:"",
    address:"",
    createdAt:Date.now(),
    updatedAt:Date.now()
  });

  alert("Account created successfully");
  location.href="login.html";
};

window.login = async function(email,password){

  await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = auth.currentUser.uid;

  const snap = await get(ref(db,"users/"+uid));

  if(!snap.exists()){
    alert("User profile not found");
    await signOut(auth);
    return;
  }

  const user = snap.val();

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  await update(
    ref(db,"users/"+uid),
    {
      lastLogin:Date.now()
    }
  );

  switch(user.role){

    case "admin":
      location.href="admin.html";
      break;

    case "seller":
      location.href="seller.html";
      break;

    default:
      location.href="index.html";

  }

};

window.logout = async function(){

  await signOut(auth);

  localStorage.removeItem("user");

  location.href="login.html";

};

window.currentUser = function(callback){

  onAuthStateChanged(auth,callback);

};

window.getProfile = async function(){

  if(!auth.currentUser) return null;

  const snap = await get(
    ref(db,"users/"+auth.currentUser.uid)
  );

  return snap.exists() ? snap.val() : null;

};

console.log("MJH Firebase Authentication Ready");
