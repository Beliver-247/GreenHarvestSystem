const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const qaRecordSchema = new Schema({
    vegetableType: {
        type: String,
        required: true,
        enum: ["Carrot", "Leek", "Cabbage", "Potato"]
    },
    gradeAWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number']
    },
    gradeBWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number']
    },
    gradeCWeight: {
        type: Number,
        required: true,
        min: [0, 'Weight must be a positive number']
    },
    batchId: { // Add the batchId field
        type: Schema.Types.ObjectId,
        ref: 'IncomingBatch',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});


const QARecord = mongoose.model("QARecord", qaRecordSchema);

module.exports = QARecord;
