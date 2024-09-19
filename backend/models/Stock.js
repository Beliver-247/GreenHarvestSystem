const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    vegType: {
        type: String,
        enum: ['Carrot', 'Leeks', 'Cabbage', 'Potato'],
        required: true
    },

    qualityGrade: {
        type: String,
        enum: ['A', 'B', 'C'],
        required: true
    },

    batchNumber: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    expDate: {
        type: Date,
        required: true
    },
})

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;