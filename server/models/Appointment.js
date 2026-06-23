import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientName: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  doctorName: String,
  doctorSpecialization: String,
  appointmentDate: String,
  appointmentTime: String,
  appointmentStatus: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  symptoms: String,
  paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  amount: Number,
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
