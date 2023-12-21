create order sample
{
  "pid": "6583c7ad838bc658ffc8a187",        // Product ID (adjust as needed)
  "uid": "6583d6b0136381405ff20b21",        // User ID (adjust as needed)
  "quantity": 111   // Order quantity (adjust as needed)
}

fetchordersbyuser 
sample url  http://localhost:8080/orders/user?uid=6583d6b0136381405ff20b21


delete orders
sample url http://localhost:8080/orders/6583f6a8e3182b2a71c01405
create order cart:
{
  "uid": "6583d6b0136381405ff20b21"
}

cart adding

{
  "pid": "60f6bfe4c49a7927d8e4b59f", // Replace with a valid product ID
  "uid": "60f6bfe4c49a7927d8e4b5a0", // Replace with a valid user ID
  "quantity": 2
}

cart getbyuser
sample url http://localhost:8080/carts?uid=6583d6b0136381405ff20b21




