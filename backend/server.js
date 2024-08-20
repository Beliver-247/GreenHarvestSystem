const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful!!");
})

// Import routes
const newBatchRouter = require("./routes/newBatches.js");
const qaStandardsRouter = require("./routes/qaStandards.js");  
const QARecordRouter = require("./routes/QArecord.js")

// Use routes
app.use("/newBatch", newBatchRouter);
app.use("/qaStandards", qaStandardsRouter);  
app.use("/QArecord",QARecordRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
});
