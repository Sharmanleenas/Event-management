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
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  const rootDir = path.resolve();
  const frontendPath = path.join(rootDir, "frontend", "dist");
  
  console.log(`[Production] Serving static files from: ${frontendPath}`);
  app.use(express.static(frontendPath));

  // SPA fallback using middleware to avoid compatibility issues with '*' wildcards in Node v25+
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(frontendPath, "index.html"), (err) => {
        if (err) {
          console.error(`[SPA Error] Failed to send index.html: ${err.message}`);
          res.status(500).send("Frontend build not found. Please run 'npm run build' in the frontend directory.");
        }
      });
    } else {
      next();
    }
  });
}

// Error Handling
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});