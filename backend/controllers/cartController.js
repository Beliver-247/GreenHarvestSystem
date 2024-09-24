//TODO - Dilukshan
const userModel = require("../models/UserModel.js");

// Add item to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

module.exports = { addToCart, removeFromCart, getCart };













// const addToCart = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const itemId = req.body.itemId;

//         // Fetch the user by ID
//         const userData = await userModel.findById(userId);
        
//         // Initialize cartData if it's undefined
//         let cartData = userData.cartData || {};

//         // Add or update the item in the cart
//         cartData[itemId] = (cartData[itemId] || 0) + 1;

//         // Update the user's cart data
//         const result = await userModel.updateOne(
//             { _id: userId },
//             { $set: { cartData: cartData } }
//         );

//         if (result.nModified > 0) {
//             res.json({ success: true, message: "Added to cart" });
//         } else {
//             res.status(500).json({ success: false, message: "Failed to update cart" });
//         }

//     } catch (error) {
//         console.error("Error adding item to cart:", error);
//         res.status(500).json({ success: false, message: "Failed to add item to cart" });
//     }
// };




// const addToCart = async (req, res) => {
//     try {
//         // Fetch the user by ID
//         const userData = await userModel.findById(req.body.userId);
        
//         // Initialize cartData if it's undefined
//         let cartData = userData.cartData || {};

//         // Check if the item exists in the cart; if not, initialize it
//         if (!cartData[req.body.itemId]) {
//             cartData[req.body.itemId] = 1;
//         } else {
//             cartData[req.body.itemId] += 1;
//         }

//         // Update the user with the modified cart data
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData });

//         // Send a success response
//         res.json({ success: true, message: "Added to cart" });

//     } catch (error) {
//         console.error("Error adding item to cart:", error);

//         // Send an error response with more context
//         res.status(500).json({ success: false, message: "Failed to add item to cart" });
//     }
// };