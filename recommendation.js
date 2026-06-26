export function recommend(products, currentCategory){

  const list = Object.values(products || {});

  return list
    .filter(p => p.category === currentCategory)
    .sort((a,b) => (b.sold||0) - (a.sold||0))
    .slice(0,5);
}
