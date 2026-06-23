import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const register = async (req, res) => {
  try {
    const { name, email, password, photo, phone, gender, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash password if provided (for email/password login)
    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo: photo || "",
      phone: phone || "",
      gender: gender || "",
      role: role || "patient",
      status: "active"
    });

    await newUser.save();

    if (newUser.role === "doctor") {
      const newDoctor = new Doctor({
        doctorName: newUser.name,
        email: newUser.email,
        specialization: "General Practice", // default
        hospitalName: "MediCare Hospital", // default
        profileImage: newUser.photo || "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&auto=format",
        verificationStatus: "pending"
      });
      await newDoctor.save();
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photo: newUser.photo
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin login bypass
    if (email === "admin" && password === "admin@123") {
      const token = jwt.sign(
        { id: "admin_id_hardcoded", role: "admin", email: "admin@medicare.com" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: "admin_id_hardcoded",
          name: "System Administrator",
          email: "admin",
          role: "admin",
          photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format"
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account is suspended." });
    }

    if (!user.password && password) {
      return res.status(400).json({ message: "This account was created using Google Login." });
    }

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
