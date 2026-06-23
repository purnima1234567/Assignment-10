import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientName: String,
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  diagnosis: String,
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
    }
  ],
  notes: String,
}, { timestamps: true });

export default mongoose.model("Prescription", prescriptionSchema);
