const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/UserRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const cookieParser = require("cookie-parser");


// Load environment variables from .env file
dotenv.config();

require('./schedulers/licenseCheckScheduler.js');  // Load any scheduled tasks

const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:3000", // Adjust if your frontend runs on a different port
    credentials: true
}));
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful!!");
})

// Import routes
// const newBatchRouter = require("./routes/newBatches.js");
// const qaStandardsRouter = require("./routes/qaStandards.js");  
// const QARecordRouter = require("./routes/QArecord.js")

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
// app.use("/newBatch", newBatchRouter);
// app.use("/qaStandards", qaStandardsRouter);  
// app.use("/QArecord",QARecordRouter);

// Use routes - inventory
app.use("/stock", stockRouter);
app.use("/staff", staffRouter);

app.use("/vehicle", vehicleRouter);//hiran
app.use("/driver", driverRouter);
app.use("/fuelpurchase", fuelpurchaseRouter); 
app.use("/maintain", maintainRouter);
app.use('/efficiency', fuelEfficiencyRouter);
app.use('/expenses', expensesRouter);//hiran

// Dilukshan
app.use("/api/user", userRoutes);
app.use("/api/auth", AuthRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
});
