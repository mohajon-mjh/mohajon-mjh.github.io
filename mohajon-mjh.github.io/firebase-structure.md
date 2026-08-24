USERS/
  uid/
    role: customer | seller | admin

PRODUCTS/
  productId/
    sellerId
    name
    price
    stock
    category
    image
    sold

ORDERS/
  orderId/
    userId
    sellerId
    items[]
    status
    paymentMethod
    orderDate

CARTS/
  uid/
    items[]

WISHLIST/
  uid/
    items[]
