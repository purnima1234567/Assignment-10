import Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyDoctor = async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
