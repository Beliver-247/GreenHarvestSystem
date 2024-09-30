const orderModel = require("../models/OrderModel.js");

// Place Order
const placeOrder = async (req, res) => {

    const frontendUrl = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.totalAmount,
            address: req.body.address,
            billingAddress: req.body.billingAddress,
            payment: false
        });

        await newOrder.save();

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const success_url = `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`;

        res.json({ success: true, orderId: newOrder._id, url: success_url, message: "Order placed. Please proceed with payment." });

    } catch (error) {
        console.log(error);
        const cancel_url = `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`;
        res.json({ success: false, url: cancel_url, message: "Error placing order" });
    }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
        if (order) {
            res.json({ success: true, message: "Payment confirmed. Order is now paid." });
        } else {
            res.json({ success: false, message: "Order not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error confirming payment" });
    }
};


const userOrders = async (req, res) => {
    try {
        const { userId } = req.body; // userId is set by authMiddleware
        const orders = await orderModel.find({ userId: userId });
        
        if (orders.length === 0) {
            return res.json({ success: false, message: "No orders found for this user ID." });
        }

        res.json({ success: false, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List Orders for Admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Fetch order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    try {
        const order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching order" });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    const { orderId, status } = req.body;
  
    // Check if orderId and status are provided
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }
  
    try {
      // Find and update the order status
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true } // Return the updated document
      );
  
      // If order is not found, return an error
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
      // Successfully updated the status
      res.status(200).json({ success: true, message: "Status updated", order: updatedOrder });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ success: false, message: "Error updating status" });
    }
};

// Function to delete an order by ID
const deleteOrderById = async (req, res) => {
    const orderId = req.params.id; // Get the order ID from the request parameters
  
    try {
      const order = await orderModel.findByIdAndDelete(orderId); // Delete the order from the database
  
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" }); // If not found
      }
  
      res.json({ success: true, message: "Order deleted successfully" }); // Successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error deleting order" }); // Error handling
    }
  };

// Add a New Order
const addOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            billingAddress: req.body.billingAddress || req.body.address,
            payment: req.body.payment
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order added successfully", savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to add order", error: error.message });
    }
};

// Fetch All Orders
const fetchAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order by ID
const updateOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await orderModel.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    placeOrder,
    confirmPayment,
    userOrders,
    listOrders,
    updateStatus,
    addOrder,
    fetchAllOrders,
    updateOrderById,
    getOrderById,
    deleteOrderById 
};
