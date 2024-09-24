const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true
});

const cartSchema = new mongoose.Schema({
    //TODO: Add user reference(Dilukshan)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [cartItemSchema],
}, {
    timestamps: true
});

const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

module.exports = cartModel;

