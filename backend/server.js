const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

dotenv.config();
connectDB();

const app = express();   // ✅ create app first

// Create a log stream for debugging
// No file logging
app.use(morgan("dev"));  // ✅ now it works

// Relaxed Rate Limiter for Dev/Testing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(limiter);

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/participants", require("./routes/participantRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/certificate", require("./routes/certificateRoutes"));
app.use("/api/ses", require("./routes/sesRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));

const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);