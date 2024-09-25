const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
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
const PORT = process.env.PORT || 9000;
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

// Importing routes
const userRoutes = require("./routes/UserRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
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

// Routes for QA and IncomingBatches
const qaStandardsRouter = require("./routes/qaStandards");
const QARecordRouter = require("./routes/QArecord");
const QAteamRouter = require("./routes/QATeam");
const newBatchRouter = require("./routes/IncomingBatches")(io); // Pass io instance

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/auth", AuthRoute);
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

// Scheduler
require('./schedulers/licenseCheckScheduler.js');

// Socket.io for handling real-time connections
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

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
