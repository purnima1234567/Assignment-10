import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/users.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import paymentRoutes from "./routes/payments.js";
import analyticsRoutes from "./routes/analytics.js";
import authRoutes from "./routes/auth.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
