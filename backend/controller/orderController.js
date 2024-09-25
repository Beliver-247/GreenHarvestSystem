const orderModel = require("../models/OrderModel.js");
// const userModel = require("../models/userModel.js");

// Place Order
const placeOrder = async (req, res) => {
    console.log("Place Order Route Hit");

    const frontendUrl = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.totalAmount,
            address: req.body.address,
            payment: false
        });

        await newOrder.save();

        // await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

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

// User Orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error });
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

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
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
    updateOrderById
};
