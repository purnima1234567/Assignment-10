import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import mongoose from "mongoose";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";
import Payment from "./models/Payment.js";
import Review from "./models/Review.js";

const MONGODB_URI = process.env.MONGODB_URI;

const userData = [
  { name: "John Patient", email: "patient@demo.com", role: "patient", status: "active", phone: "+1 555-0101", gender: "Male" },
  { name: "Alice Smith", email: "alice.smith@email.com", role: "patient", status: "active", phone: "+1 555-0102", gender: "Female" },
  { name: "Bob Johnson", email: "bob.johnson@email.com", role: "patient", status: "suspended", phone: "+1 555-0103", gender: "Male" },
  { name: "Dr. Sarah Mitchell", email: "doctor@demo.com", role: "doctor", status: "active", phone: "+1 555-0201", gender: "Female" },
  { name: "Dr. David Park", email: "david.park@medicare.com", role: "doctor", status: "active", phone: "+1 555-0202", gender: "Male" },
  { name: "Admin User", email: "admin@medicare.com", role: "admin", status: "active", phone: "+1 555-0301", gender: "Male" },
];

const doctorData = [
  {
    doctorName: "Dr. Sarah Mitchell", specialization: "Cardiology",
    qualifications: ["MBBS", "MD (Cardiology)", "DM (Interventional Cardiology)"],
    experience: 14, consultationFee: 800, hospitalName: "Apollo Heart Center",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    verificationStatus: "verified", rating: 4.9, reviewCount: 187,
    about: "Dr. Sarah Mitchell is a leading cardiologist with 14 years of experience...",
    email: "doctor@demo.com",
  },
  {
    doctorName: "Dr. James Okafor", specialization: "Neurology",
    qualifications: ["MBBS", "MD (Neurology)", "Fellowship (USA)"],
    experience: 11, consultationFee: 900, hospitalName: "NeuroCare Institute",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"],
    verificationStatus: "verified", rating: 4.8, reviewCount: 142,
    about: "Dr. James Okafor is a distinguished neurologist...",
    email: "james.okafor@medicare.com",
  },
  {
    doctorName: "Dr. Priya Sharma", specialization: "Pediatrics",
    qualifications: ["MBBS", "DCH", "MD (Pediatrics)"],
    experience: 9, consultationFee: 600, hospitalName: "Rainbow Children's Hospital",
    profileImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"],
    verificationStatus: "verified", rating: 4.9, reviewCount: 231,
    about: "Dr. Priya Sharma is a compassionate pediatrician...",
    email: "priya.sharma@medicare.com",
  },
  {
    doctorName: "Dr. Robert Chen", specialization: "Orthopedics",
    qualifications: ["MBBS", "MS (Orthopedics)", "Fellowship (Sports Medicine)"],
    experience: 16, consultationFee: 750, hospitalName: "OrthoMax Clinic",
    profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
    verificationStatus: "verified", rating: 4.7, reviewCount: 164,
    about: "Dr. Robert Chen is an orthopedic surgeon...",
    email: "robert.chen@medicare.com",
  },
  {
    doctorName: "Dr. Amina Hassan", specialization: "Dermatology",
    qualifications: ["MBBS", "DVD", "MD (Dermatology)"],
    experience: 8, consultationFee: 650, hospitalName: "SkinCare Wellness Center",
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Tuesday", "Wednesday", "Friday"],
    availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
    verificationStatus: "verified", rating: 4.8, reviewCount: 118,
    about: "Dr. Amina Hassan specializes in medical and cosmetic dermatology...",
    email: "amina.hassan@medicare.com",
  },
  {
    doctorName: "Dr. Michael Torres", specialization: "General Medicine",
    qualifications: ["MBBS", "MD (General Medicine)", "MRCP"],
    experience: 12, consultationFee: 500, hospitalName: "CityHealth Medical Center",
    profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    verificationStatus: "verified", rating: 4.6, reviewCount: 298,
    about: "Dr. Michael Torres is a compassionate general practitioner...",
    email: "michael.torres@medicare.com",
  },
  {
    doctorName: "Dr. Fatima Al-Rashid", specialization: "Gynecology",
    qualifications: ["MBBS", "MS (Obstetrics & Gynecology)", "Fellowship (Laparoscopy)"],
    experience: 13, consultationFee: 700, hospitalName: "Women's Care Hospital",
    profileImage: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
    verificationStatus: "verified", rating: 4.9, reviewCount: 203,
    about: "Dr. Fatima Al-Rashid is an experienced obstetrician and gynecologist...",
    email: "fatima.rashid@medicare.com",
  },
  {
    doctorName: "Dr. David Park", specialization: "Ophthalmology",
    qualifications: ["MBBS", "MS (Ophthalmology)", "Fellowship (Retina)"],
    experience: 10, consultationFee: 680, hospitalName: "VisionPlus Eye Hospital",
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format&face=1",
    availableDays: ["Tuesday", "Thursday", "Friday", "Saturday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    verificationStatus: "pending", rating: 4.7, reviewCount: 96,
    about: "Dr. David Park is a skilled ophthalmologist...",
    email: "david.park@medicare.com",
  },
];

const appointmentData = [
  { patientName: "John Patient", doctorName: "Dr. Sarah Mitchell", doctorSpecialization: "Cardiology", appointmentDate: "2025-01-20", appointmentTime: "10:00 AM", appointmentStatus: "confirmed", symptoms: "Chest pain and shortness of breath", paymentStatus: "paid", amount: 800 },
  { patientName: "John Patient", doctorName: "Dr. Michael Torres", doctorSpecialization: "General Medicine", appointmentDate: "2025-01-15", appointmentTime: "09:00 AM", appointmentStatus: "completed", symptoms: "Routine checkup", paymentStatus: "paid", amount: 500 },
  { patientName: "John Patient", doctorName: "Dr. Priya Sharma", doctorSpecialization: "Pediatrics", appointmentDate: "2025-01-10", appointmentTime: "11:00 AM", appointmentStatus: "cancelled", symptoms: "Child fever", paymentStatus: "unpaid", amount: 600 },
  { patientName: "Alice Smith", doctorName: "Dr. Sarah Mitchell", doctorSpecialization: "Cardiology", appointmentDate: "2025-01-22", appointmentTime: "02:00 PM", appointmentStatus: "pending", symptoms: "High blood pressure", paymentStatus: "unpaid", amount: 800 },
];

const paymentData = [
  { patientName: "John Patient", doctorName: "Dr. Sarah Mitchell", amount: 800, transactionId: "TXN-2025-001A4F", paymentDate: "2025-01-18" },
  { patientName: "John Patient", doctorName: "Dr. Michael Torres", amount: 500, transactionId: "TXN-2025-002B7G", paymentDate: "2025-01-13" },
];

const reviewData = [
  { patientName: "Emily Johnson", patientPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format", doctorName: "Dr. Sarah Mitchell", rating: 5, reviewText: "Dr. Mitchell is absolutely exceptional..." },
  { patientName: "Marcus Williams", patientPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format", doctorName: "Dr. Priya Sharma", rating: 5, reviewText: "Dr. Sharma is the most caring doctor..." },
  { patientName: "Sophia Chen", patientPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format", doctorName: "Dr. Amina Hassan", rating: 5, reviewText: "After years of struggling with severe acne..." },
  { patientName: "Daniel Rodriguez", patientPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format", doctorName: "Dr. Robert Chen", rating: 4, reviewText: "Dr. Chen performed my knee replacement..." },
  { patientName: "Aisha Patel", patientPhoto: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&auto=format", doctorName: "Dr. James Okafor", rating: 5, reviewText: "I had been suffering from migraines..." },
  { patientName: "Thomas Anderson", patientPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format", doctorName: "Dr. Michael Torres", rating: 5, reviewText: "Dr. Torres is the kind of doctor everyone needs..." },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    const createdUsers = await User.create(userData);
    const createdDoctors = await Doctor.create(doctorData);
    console.log(`Seeded ${createdUsers.length} users and ${createdDoctors.length} doctors`);

    const appointmentsWithRefs = appointmentData.map((a, i) => ({
      ...a,
      patientId: createdUsers[i % createdUsers.length]._id,
      doctorId: createdDoctors.find((d) => d.doctorName === a.doctorName)?._id || createdDoctors[0]._id,
    }));
    const createdAppointments = await Appointment.create(appointmentsWithRefs);
    console.log(`Seeded ${createdAppointments.length} appointments`);

    const paymentsWithRefs = paymentData.map((p, i) => ({
      ...p,
      appointmentId: createdAppointments[i % createdAppointments.length]._id,
      patientId: createdUsers[i % createdUsers.length]._id,
      doctorId: createdDoctors.find((d) => d.doctorName === p.doctorName)?._id || createdDoctors[0]._id,
    }));
    await Payment.create(paymentsWithRefs);
    console.log(`Seeded ${paymentData.length} payments`);

    const reviewsWithRefs = reviewData.map((r) => ({
      ...r,
      doctorId: createdDoctors.find((d) => d.doctorName === r.doctorName)?._id || createdDoctors[0]._id,
      patientId: createdUsers[0]._id,
    }));
    await Review.create(reviewsWithRefs);
    console.log(`Seeded ${reviewData.length} reviews`);

    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
