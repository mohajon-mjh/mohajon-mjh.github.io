import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const db = getDatabase();

export function listenOrders(callback){
  onValue(ref(db,"orders"), snap=>{
    callback(snap.val() || {});
  });
}

export function listenProducts(callback){
  onValue(ref(db,"products"), snap=>{
    callback(snap.val() || {});
  });
}
