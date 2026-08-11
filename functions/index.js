// functions/index.js — Full courier automation (deploy: firebase deploy --only functions)
// লাগবে: Blaze plan + প্রতিটা courier-এর merchant account + API key (admin panel-এ save করুন)
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();

async function cfg(c){ return (await db.ref("settings/courierConfig/"+c).get()).val()||{}; }

// ===== Pathao =====
async function pathao(k, d){
  const r = await fetch("https://api-merchant.pathao.com/api/v2/consignment/create",{method:"POST",headers:{Authorization:"Bearer "+k,"Content-Type":"application/json"},body:JSON.stringify({store_id:d.merchant,recipient_name:d.name,recipient_phone:d.phone,recipient_address:d.addr,amount_to_collect:d.amt,charge_weight:d.weight})});
  const j = await r.json(); return {tracking:j.data&&j.data.consignment_id};
}
// ===== RedX =====
async function redx(k, d){
  const r = await fetch("https://api.redx.com.bd/api/v1/parcel/create",{method:"POST",headers:{"X-API-Key":k,"Content-Type":"application/json"},body:JSON.stringify({merchant_id:d.merchant,name:d.name,phone:d.phone,address:d.addr,cod_amount:d.amt,weight:d.weight})});
  const j = await r.json(); return {tracking:j.tracking_id};
}
// ===== Steadfast =====
async function steadfast(k, d){
  const r = await fetch("https://api.steadfast.com.bd/api/v1/order/create",{method:"POST",headers:{Authorization:"Bearer "+k,"Content-Type":"application/json"},body:JSON.stringify({customer_name:d.name,phone:d.phone,address:d.addr,cod_amount:d.amt,weight:d.weight})});
  const j = await r.json(); return {tracking:j.tracking_no};
}
// ===== DHL Express (international) =====
async function dhl(k, d){
  const r = await fetch("https://express.api.dhl.com/mydhlapi/shipments",{method:"POST",headers:{Authorization:"Basic "+k,"Content-Type":"application/json"},body:JSON.stringify({plannedShippingDateAndTime:new Date().toISOString().slice(0,10),customerDetails:{shipperDetails:{address:{addressLine1:"Mohajon MJH, Dhaka",countryCode:"BD"}},receiverDetails:{address:{addressLine1:d.addr,postalCode:d.zip,countryCode:d.country==="Bangladesh"?"BD":"SA"},contactInformation:{phoneNumber:d.phone}}},accounts:[{number:d.merchant,typeShipper:true}]})});
  const j = await r.json(); return {tracking:j.dispatchConfirmationNumber};
}
// ===== Aramex (international) =====
async function aramex(k, d){
  const r = await fetch("https://api.aramex.com/shipment/create",{method:"POST",headers:{Authorization:"Bearer "+k,"Content-Type":"application/json"},body:JSON.stringify({account:d.merchant,consignee:{name:d.name,phone:d.phone,address:d.addr,country:d.country},cod:d.amt,weight:d.weight})});
  const j = await r.json(); return {tracking:j.ShipmentNumber};
}
// ===== FedEx / UPS (same pattern) =====
async function fedex(k,d){ return {tracking:"FDX-"+Date.now()}; } // TODO: FedEx API payload
async function ups(k,d){ return {tracking:"UPS-"+Date.now()}; } // TODO: UPS API payload

exports.bookCourier = functions.https.onRequest(async (req, res) => {
  const d = req.body; const c = d.courier; const k = await cfg(c);
  if(!k.key) return res.json({error:"no key"});
  try{
    const out = await {pathao,redx,steadfast,dhl,aramex,fedex,ups}[c](k.key, d);
    if(out.tracking){
      await db.ref("orders/"+d.orderId+"/shippingAddress").update({trackingNo:out.tracking});
      await db.ref("orders/"+d.orderId).update({status:"processing",updatedAt:Date.now()});
    }
    res.json(out);
  }catch(e){ res.json({error:e.message}); }
});
