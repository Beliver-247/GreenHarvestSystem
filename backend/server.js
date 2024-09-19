const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

require('./schedulers/licenseCheckScheduler.js');  // Load any scheduled tasks

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

//Inventory routes - Senath
const stockRouter = require("./routes/stocks.js");
const staffRouter = require("./routes/staffMembers.js");

const driverRouter = require("./routes/drivers.js"); // hiran
const vehicleRouter = require("./routes/vehicles.js");
const fuelpurchaseRouter = require("./routes/fuelpurchase.js");
const maintainRouter = require("./routes/maintain.js");
const fuelEfficiencyRouter = require('./routes/fuelEfficiency');
const expensesRouter = require('./routes/expenses'); // hiran

// Use routes
app.use("/newBatch", newBatchRouter);
app.use("/qaStandards", qaStandardsRouter);  
app.use("/QArecord",QARecordRouter);

// Use routes - inventory
app.use("/stock", stockRouter);
app.use("/staff", staffRouter);

app.use("/vehicle", vehicleRouter);//hiran
app.use("/driver", driverRouter);
app.use("/fuelpurchase", fuelpurchaseRouter); 
app.use("/maintain", maintainRouter);
app.use('/efficiency', fuelEfficiencyRouter);
app.use('/expenses', expensesRouter);//hiran

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
});
