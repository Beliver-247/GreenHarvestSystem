const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require('path');
const { Server } = require("socket.io");


// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app); // Use http server for socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Set up PORT and MongoDB URL
const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URL;

// MongoDB connection
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
  console.log("MongoDB connection successful!!");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Importing routes from both server.js files
// Farmer Routes
const farmerRouter = require("./routes/farmer_routes.js");
app.use("/farmer", farmerRouter);

// Crop Readiness Routes
const cropReadinessRoutes = require('./routes/cropReadinessRoutes');  
app.use('/cropReadiness', cropReadinessRoutes);  

// Pickup request Routes
const pickupRequestRoutes = require('./routes/pickupRequestRoutes');
app.use('/pickup-request', pickupRequestRoutes);

// Land Routes
const landRoutes = require("./routes/land_routes");
app.use("/land", landRoutes); 

// User-related Routes (from group project)
const userRoutes = require("./routes/UserRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
app.use("/api/user", userRoutes);
app.use("/api/auth", AuthRoute);

// Other Routes (from group project)
const stockRouter = require("./routes/stocks.js");
const staffRouter = require("./routes/staffMembers.js");
const driverRouter = require("./routes/drivers.js");
const vehicleRouter = require("./routes/vehicles.js");
const fuelpurchaseRouter = require("./routes/fuelpurchase.js");
const maintainRouter = require("./routes/maintain.js");
const fuelEfficiencyRouter = require("./routes/fuelEfficiency");
const expensesRouter = require('./routes/expenses');
const orderRoutes = require("./routes/orderRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const farmerRequestRoutes = require("./routes/farmerRequestRoutes.js");
const customerRequestRoutes = require("./routes/customerRequestRoutes.js");
const productRoutes = require('./routes/productRoutes');

// Routes for QA and Incoming Batches (with socket.io integration)
const qaStandardsRouter = require("./routes/qaStandards");
const QARecordRouter = require("./routes/QArecord")(io);
const QAteamRouter = require("./routes/QATeam");
const newBatchRouter = require("./routes/IncomingBatches")(io); 

app.use("/stock", stockRouter);
app.use("/staff", staffRouter);
app.use("/vehicle", vehicleRouter);
app.use("/driver", driverRouter);
app.use("/fuelpurchase", fuelpurchaseRouter);
app.use("/maintain", maintainRouter);
app.use("/efficiency", fuelEfficiencyRouter);
app.use("/expenses", expensesRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRouter);
app.use("/api", farmerRequestRoutes);
app.use("/api", customerRequestRoutes);
app.use("/qaStandards", qaStandardsRouter);
app.use("/QArecord", QARecordRouter);
app.use("/QATeam", QAteamRouter);
app.use("/incomingBatches", newBatchRouter);
app.use('/api/products', productRoutes);

// Scheduler
require('./schedulers/licenseCheckScheduler.js');

// Socket.io for handling real-time connections
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Production mode setup (serve frontend if in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
