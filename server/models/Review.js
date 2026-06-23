import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientName: String,
  patientPhoto: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  doctorName: String,
  rating: Number,
  reviewText: String,
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
