// const express = require("express");
// const authMiddleware = require("../middleware/auth.js");
// const orderModel = require("../models/OrderModel.js");

// //TODO- senath
// // const userModel = require("../model/userModel.js");

// const orderRouter = express.Router();

// // Controller logic inside the router file

// // Place Order
// const placeOrder = async (req, res) => {
//     console.log("Place Order Route Hit");

//     const frontendUrl = "http://localhost:5173";

//     try {
//         // Step 1: Create a new order
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,  // Fix from `req.body.item` to `req.body.items`
//             amount: req.body.totalAmount,  // Fix from `req.body.amount` to `req.body.totalAmount`
//             address: req.body.address,
//             payment: false // Mark as unpaid initially
//         });
//         console.log("Place Order Route Hit inside 1");

//         // Step 2: Save the order in the database
//         await newOrder.save();
//         console.log("inside 2");

//         // Step 3: Clear the user's cart after placing the order
//         // await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         // Step 4: Create success and cancel URLs
//         const success_url = `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`;
    
//         // Step 5: Respond with the order ID or any other information
//         res.json({ success: true, orderId: newOrder._id, url: success_url, message: "Order placed. Please proceed with payment." });

//     } catch (error) {
//         console.log(error);
//         const cancel_url = `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`;

//         res.json({ success: false, url: cancel_url, message: "Error placing order" });
//     }
// };


// // Confirm Payment
// const confirmPayment = async (req, res) => {
//     const { orderId } = req.body;
//     try {
//         // Step 6: Update the order status to paid
//         const order = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
//         if (order) {
//             res.json({ success: true, message: "Payment confirmed. Order is now paid." });
//         } else {
//             res.json({ success: false, message: "Order not found" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error confirming payment" });
//     }
// };

// // User Orders
// const userOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({ userId:req.body.userId });
//         res.json({success:true, data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error})
//     }
// }

// // List Orders for Admin
// const listOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({});
//         res.json({ success:true, data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"error"})
//     }
// }

// // Update Order Status
// const updateStatus = async (req, res) => {
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
//         res.json({success:true, message:"Status updated"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"})
//     }
// }

// // Defining Routes
// orderRouter.post("/place", authMiddleware, placeOrder);
// orderRouter.post("/verify", confirmPayment);
// orderRouter.post("/userorders", authMiddleware, userOrders);
// orderRouter.get("/list", listOrders);
// orderRouter.post("/status", updateStatus);

// module.exports = orderRouter;



const express = require("express");
const orderModel = require("../models/OrderModel");

const router = express.Router();

// Create a new order
router.post("/add-order", async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            billingAddress: req.body.billingAddress || req.body.address, // optional billing address
            payment: req.body.payment
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order added successfully", savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to add order", error: error.message });
    }
});

// Route to fetch all orders
router.get("/list-all-orders", async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Route to update an existing order by ID
router.put("/list-all-orders/:id", async (req, res) => {
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
});

module.exports = router;



