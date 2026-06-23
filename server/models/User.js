import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  photo: { type: String, default: "" },
  phone: { type: String, default: "" },
  gender: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
