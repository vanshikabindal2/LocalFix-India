const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

// Now environment variables can be accessed
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS =",
  process.env.EMAIL_PASS ? "LOADED ✅" : "MISSING ❌"
);
const aiRoutes = require("./Routes/AIRoutes");
const complaintRoutes = require("./Routes/ComplaintRoutes");
const authRoutes = require("./Routes/AuthRoutes");
const alertAlertRoutes=require("./Routes/AreaAlertRoutes")
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api/area-alerts",alertAlertRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("LocalFix India backend is running ✈️");
});

// Complaint routes
app.use("/api/complaints", complaintRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(process.env.PORT || 5001, () => {
      console.log(
        `Server running on port ${
          process.env.PORT || 5001
        } ✈️`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });