export function calculateBusiness(products, orders){

  let revenue = 0;
  let profit = 0;
  let topProduct = null;

  let best = 0;

  Object.values(products || {}).forEach(p=>{
    if((p.sold||0) > best){
      best = p.sold;
      topProduct = p;
    }
  });

  Object.values(orders || {}).forEach(o=>{
    if(o.status === "delivered"){
      (o.items||[]).forEach(i=>{
        revenue += (i.price||0)*(i.qty||1);
      });
    }
  });

  profit = revenue * 0.85; // 15% platform fee

  return {
    revenue,
    profit,
    topProduct
  };
}
