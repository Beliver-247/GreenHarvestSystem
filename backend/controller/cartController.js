// Import the User model
const User = require("../models/Usermodel.js");

const addToCart = async (req, res) => {
    try {
        // Use the userId from the request body for fetching and updating the user
        const userId = req.body.userId;
        // const userId= "66f298c0d55b83bfb172a269";
        
        // Find the user by userId
        let userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Retrieve the cartData or initialize it as an empty object
        let cartData = userData.cartData || {};

        // Add or update the item in the cart
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        // Update the user's cart data
        await User.findByIdAndUpdate(userId, { cartData });

        // Send a success response
        res.json({ success: true, message: "Added to cart" });

    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, message: "Failed to add item to cart" });
    }
};


// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await User.findById(req.body.userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await User.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await User.findById(req.body.userId);
        let cartData = userData.cartData;

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

module.exports = { addToCart, removeFromCart, getCart };
