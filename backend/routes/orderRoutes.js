const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const { 
    placeOrder, 
    confirmPayment, 
    userOrders, 
    listOrders, 
    updateStatus, 
    addOrder, 
    fetchAllOrders, 
    updateOrderById 
} = require("../controllers/orderController.js");

const orderRouter = express.Router();

// Route definitions
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", confirmPayment);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

// New routes
orderRouter.post("/add-order", addOrder);  // Add a new order
orderRouter.get("/list-all-orders", fetchAllOrders);  // Fetch all orders
orderRouter.put("/list-all-orders/:id", updateOrderById);  // Update order by ID

module.exports = orderRouter;
