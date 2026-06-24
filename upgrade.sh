#!/data/data/com.termux/files/usr/bin/bash
set -e

cd ~/mohajon-mjh.github.io

mkdir -p backup
cp login.html backup/login.html.$(date +%F-%H%M%S) 2>/dev/null || true
cp signup.html backup/signup.html.$(date +%F-%H%M%S) 2>/dev/null || true

cat > assets/js/firebase.js <<'JS'
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

window.MJH = {
  auth,
  onAuthStateChanged,
  signOut
};

console.log("MJH Firebase Ready");
JS

echo "Firebase module created."

if [ -x ~/.auto_push_mjh ]; then
  ~/.auto_push_mjh
fi

echo
echo "Upgrade v5 Complete."
echo "Next: Real Login + Signup"
