import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientName: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  doctorName: String,
  amount: Number,
  transactionId: { type: String, unique: true },
  paymentDate: String,
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
