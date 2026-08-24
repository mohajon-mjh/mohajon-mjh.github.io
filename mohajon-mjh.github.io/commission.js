export function calculateCommission(order, rate = 0.10){

  let total = 0;

  (order.items || []).forEach(i=>{
    total += (i.price || 0) * (i.qty || 1);
  });

  const commission = total * rate;
  const sellerEarning = total - commission;

  return {
    total,
    commission,
    sellerEarning
  };
}
