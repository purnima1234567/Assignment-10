import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  specialization: { type: String, required: true },
  qualifications: [String],
  experience: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  hospitalName: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  availableDays: [String],
  availableSlots: [String],
  verificationStatus: { type: String, enum: ["verified", "pending", "rejected"], default: "pending" },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  about: { type: String, default: "" },
  email: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
