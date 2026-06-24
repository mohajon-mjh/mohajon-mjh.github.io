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
get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig={
apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
authDomain:"mohajon-mjh.firebaseapp.com",
databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",
projectId:"mohajon-mjh",
storageBucket:"mohajon-mjh.firebasestorage.app",
messagingSenderId:"526105903976",
appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getDatabase(app);

window.signup=async(name,email,password)=>{
const user=await createUserWithEmailAndPassword(auth,email,password);

await set(ref(db,"users/"+user.user.uid),{
uid:user.user.uid,
name:name,
email:email,
role:"buyer",
status:"active",
createdAt:Date.now()
});

alert("Signup Successful");
location="login.html";
};

window.login=async(email,password)=>{
await signInWithEmailAndPassword(auth,email,password);

const uid=auth.currentUser.uid;
const snap=await get(ref(db,"users/"+uid));

if(!snap.exists()){
alert("User profile missing");
return;
}

const user=snap.val();

localStorage.setItem("user",JSON.stringify(user));

if(user.role==="admin"){
location="admin.html";
}else if(user.role==="seller"){
location="seller.html";
}else{
location="index.html";
}
};

window.logout=async()=>{
await signOut(auth);
localStorage.removeItem("user");
location="login.html";
};

window.currentUser=callback
=>{
onAuthStateChanged(auth,user=>{
callback(user);
});
};

console.log("MJH Authentication Ready");
