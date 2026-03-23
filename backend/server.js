const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/participants", require("./routes/participantRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/certificate", require("./routes/certificateRoutes"));
app.use("/api/iqac", require("./routes/iqacRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/sliders", require("./routes/sliderRoutes"));

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  const rootDir = path.resolve();
  const frontendPath = path.join(rootDir, "frontend", "dist");
  
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(frontendPath, "index.html"));
    }
  });
}

// Error Handling
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));