export function sendOrderNotification(order){

  const msg =
`🛒 New Order Received
OrderID: ${order.orderId}
Name: ${order.name}
Phone: ${order.phone}
Total Items: ${(order.items||[]).length}
Status: ${order.status}`;

  console.log("NOTIFY:", msg);

  // Future upgrade: WhatsApp API / SMS API connect here
}
