window.calculateCommission = function(price){
const commissionRate = 0.05; // 5%
return Math.floor(price * commissionRate);
};
