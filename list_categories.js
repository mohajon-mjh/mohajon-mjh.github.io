const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

get(ref(db, "categories")).then(snap => {
  snap.forEach(child => {
    console.log(child.key + " => " + child.val().name);
  });
  process.exit(0);
}).catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
