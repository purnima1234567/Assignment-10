export interface Doctor {
  id: string;
  doctorName: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  consultationFee: number;
  hospitalName: string;
  profileImage: string;
  availableDays: string[];
  availableSlots: string[];
  verificationStatus: "verified" | "pending" | "rejected";
  rating: number;
  reviewCount: number;
  about: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  role: "patient";
  photo: string;
  phone: string;
  gender: string;
  createdAt: string;
  status: "active" | "suspended";
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentStatus: "pending" | "confirmed" | "completed" | "cancelled";
  symptoms: string;
  paymentStatus: "paid" | "unpaid";
  amount: number;
}

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoto: string;
  doctorId: string;
  doctorName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  diagnosis: string;
  medications: { name: string; dosage: string; frequency: string }[];
  notes: string;
  createdAt: string;
}

export const specializations = [
  { name: "Cardiology", icon: "❤️", description: "Heart & cardiovascular care", count: 8 },
  { name: "Neurology", icon: "🧠", description: "Brain & nervous system", count: 8 },
  { name: "Orthopedics", icon: "🦴", description: "Bone & joint treatment", count: 8 },
  { name: "Pediatrics", icon: "👶", description: "Child healthcare", count: 8 },
  { name: "Dermatology", icon: "🌿", description: "Skin & hair care", count: 8 },
  { name: "Gynecology", icon: "🌸", description: "Women's health", count: 8 },
  { name: "Ophthalmology", icon: "👁️", description: "Eye care & vision", count: 8 },
  { name: "Psychiatry", icon: "🧘", description: "Mental health care", count: 8 },
  { name: "Oncology", icon: "🔬", description: "Cancer treatment", count: 8 },
  { name: "General Medicine", icon: "🩺", description: "Primary care & checkups", count: 8 },
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    doctorName: "Dr. Sarah Mitchell",
    specialization: "Cardiology",
    qualifications: ["MBBS", "MD (Cardiology)", "DM (Interventional Cardiology)"],
    experience: 14,
    consultationFee: 800,
    hospitalName: "Apollo Heart Center",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    verificationStatus: "verified",
    rating: 4.9,
    reviewCount: 187,
    about: "Dr. Sarah Mitchell is a leading cardiologist with 14 years of experience in treating complex cardiac conditions. She specializes in interventional cardiology and has performed over 2,000 successful cardiac procedures.",
    email: "doctor@demo.com",
  },
  {
    id: "d2",
    doctorName: "Dr. James Okafor",
    specialization: "Neurology",
    qualifications: ["MBBS", "MD (Neurology)", "Fellowship (USA)"],
    experience: 11,
    consultationFee: 900,
    hospitalName: "NeuroCare Institute",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"],
    verificationStatus: "verified",
    rating: 4.8,
    reviewCount: 142,
    about: "Dr. James Okafor is a distinguished neurologist specializing in epilepsy, stroke management, and neurodegenerative diseases. He trained at Harvard Medical School and brings cutting-edge neurology care to patients.",
    email: "james.okafor@medicare.com",
  },
  {
    id: "d3",
    doctorName: "Dr. Priya Sharma",
    specialization: "Pediatrics",
    qualifications: ["MBBS", "DCH", "MD (Pediatrics)"],
    experience: 9,
    consultationFee: 600,
    hospitalName: "Rainbow Children's Hospital",
    profileImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"],
    verificationStatus: "verified",
    rating: 4.9,
    reviewCount: 231,
    about: "Dr. Priya Sharma is a compassionate pediatrician dedicated to the health and wellbeing of children from newborns to teenagers. She is known for her gentle approach and expertise in child nutrition and developmental disorders.",
    email: "priya.sharma@medicare.com",
  },
  {
    id: "d4",
    doctorName: "Dr. Robert Chen",
    specialization: "Orthopedics",
    qualifications: ["MBBS", "MS (Orthopedics)", "Fellowship (Sports Medicine)"],
    experience: 16,
    consultationFee: 750,
    hospitalName: "OrthoMax Clinic",
    profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
    verificationStatus: "verified",
    rating: 4.7,
    reviewCount: 164,
    about: "Dr. Robert Chen is an orthopedic surgeon with a sub-specialty in sports medicine and joint replacement. He has treated numerous professional athletes and provides minimally invasive surgical solutions.",
    email: "robert.chen@medicare.com",
  },
  {
    id: "d5",
    doctorName: "Dr. Amina Hassan",
    specialization: "Dermatology",
    qualifications: ["MBBS", "DVD", "MD (Dermatology)"],
    experience: 8,
    consultationFee: 650,
    hospitalName: "SkinCare Wellness Center",
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Tuesday", "Wednesday", "Friday"],
    availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
    verificationStatus: "verified",
    rating: 4.8,
    reviewCount: 118,
    about: "Dr. Amina Hassan specializes in medical and cosmetic dermatology. Her expertise includes acne treatment, psoriasis management, skin cancer screening, and advanced cosmetic procedures.",
    email: "amina.hassan@medicare.com",
  },
  {
    id: "d6",
    doctorName: "Dr. Michael Torres",
    specialization: "General Medicine",
    qualifications: ["MBBS", "MD (General Medicine)", "MRCP"],
    experience: 12,
    consultationFee: 500,
    hospitalName: "CityHealth Medical Center",
    profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    verificationStatus: "verified",
    rating: 4.6,
    reviewCount: 298,
    about: "Dr. Michael Torres is a compassionate general practitioner providing comprehensive primary care. He excels at managing chronic conditions, preventive care, and coordinating specialist referrals for complex cases.",
    email: "michael.torres@medicare.com",
  },
  {
    id: "d7",
    doctorName: "Dr. Fatima Al-Rashid",
    specialization: "Gynecology",
    qualifications: ["MBBS", "MS (Obstetrics & Gynecology)", "Fellowship (Laparoscopy)"],
    experience: 13,
    consultationFee: 700,
    hospitalName: "Women's Care Hospital",
    profileImage: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&auto=format",
    availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
    verificationStatus: "verified",
    rating: 4.9,
    reviewCount: 203,
    about: "Dr. Fatima Al-Rashid is an experienced obstetrician and gynecologist specializing in high-risk pregnancies, laparoscopic surgeries, and women's reproductive health at all life stages.",
    email: "fatima.rashid@medicare.com",
  },
  {
    id: "d8",
    doctorName: "Dr. David Park",
    specialization: "Ophthalmology",
    qualifications: ["MBBS", "MS (Ophthalmology)", "Fellowship (Retina)"],
    experience: 10,
    consultationFee: 680,
    hospitalName: "VisionPlus Eye Hospital",
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format&face=1",
    availableDays: ["Tuesday", "Thursday", "Friday", "Saturday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    verificationStatus: "pending",
    rating: 4.7,
    reviewCount: 96,
    about: "Dr. David Park is a skilled ophthalmologist specializing in retinal diseases, cataract surgery, and LASIK procedures. He uses the latest technology to preserve and restore vision.",
    email: "david.park@medicare.com",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    patientId: "p1",
    patientName: "Emily Johnson",
    patientPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    rating: 5,
    reviewText: "Dr. Mitchell is absolutely exceptional. She explained my heart condition in simple terms and created a comprehensive treatment plan. My health has improved dramatically in just 3 months!",
    createdAt: "2024-11-15",
  },
  {
    id: "r2",
    patientId: "p2",
    patientName: "Marcus Williams",
    patientPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    doctorId: "d3",
    doctorName: "Dr. Priya Sharma",
    rating: 5,
    reviewText: "Dr. Sharma is the most caring doctor I've ever met. My daughter was terrified of doctors, but Dr. Sharma made the entire visit fun and stress-free. Highly recommended!",
    createdAt: "2024-12-03",
  },
  {
    id: "r3",
    patientId: "p3",
    patientName: "Sophia Chen",
    patientPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format",
    doctorId: "d5",
    doctorName: "Dr. Amina Hassan",
    rating: 5,
    reviewText: "After years of struggling with severe acne, Dr. Hassan finally found the right treatment for me. My skin has transformed completely. She's knowledgeable, patient, and truly cares about results.",
    createdAt: "2024-11-28",
  },
  {
    id: "r4",
    patientId: "p4",
    patientName: "Daniel Rodriguez",
    patientPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
    doctorId: "d4",
    doctorName: "Dr. Robert Chen",
    rating: 4,
    reviewText: "Dr. Chen performed my knee replacement surgery with incredible precision. Recovery was faster than expected. He's a true professional and the MediCare Connect platform made booking so easy.",
    createdAt: "2024-12-10",
  },
  {
    id: "r5",
    patientId: "p5",
    patientName: "Aisha Patel",
    patientPhoto: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&auto=format",
    doctorId: "d2",
    doctorName: "Dr. James Okafor",
    rating: 5,
    reviewText: "I had been suffering from migraines for years. Dr. Okafor's diagnosis and treatment have been life-changing. No more debilitating headaches! The online appointment system saved me so much time.",
    createdAt: "2024-10-22",
  },
  {
    id: "r6",
    patientId: "p6",
    patientName: "Thomas Anderson",
    patientPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
    doctorId: "d6",
    doctorName: "Dr. Michael Torres",
    rating: 5,
    reviewText: "Dr. Torres is the kind of doctor everyone needs — attentive, thorough, and genuinely compassionate. He spent a full hour with me discussing my health concerns. The digital records system is brilliant.",
    createdAt: "2024-12-01",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "patient1",
    patientName: "John Patient",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    doctorSpecialization: "Cardiology",
    appointmentDate: "2025-01-20",
    appointmentTime: "10:00 AM",
    appointmentStatus: "confirmed",
    symptoms: "Chest pain and shortness of breath",
    paymentStatus: "paid",
    amount: 800,
  },
  {
    id: "a2",
    patientId: "patient1",
    patientName: "John Patient",
    doctorId: "d6",
    doctorName: "Dr. Michael Torres",
    doctorSpecialization: "General Medicine",
    appointmentDate: "2025-01-15",
    appointmentTime: "09:00 AM",
    appointmentStatus: "completed",
    symptoms: "Routine checkup",
    paymentStatus: "paid",
    amount: 500,
  },
  {
    id: "a3",
    patientId: "patient1",
    patientName: "John Patient",
    doctorId: "d3",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialization: "Pediatrics",
    appointmentDate: "2025-01-10",
    appointmentTime: "11:00 AM",
    appointmentStatus: "cancelled",
    symptoms: "Child fever",
    paymentStatus: "unpaid",
    amount: 600,
  },
  {
    id: "a4",
    patientId: "patient2",
    patientName: "Alice Smith",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    doctorSpecialization: "Cardiology",
    appointmentDate: "2025-01-22",
    appointmentTime: "02:00 PM",
    appointmentStatus: "pending",
    symptoms: "High blood pressure",
    paymentStatus: "unpaid",
    amount: 800,
  },
];

export const payments: Payment[] = [
  {
    id: "pay1",
    appointmentId: "a1",
    patientId: "patient1",
    patientName: "John Patient",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    amount: 800,
    transactionId: "TXN-2025-001A4F",
    paymentDate: "2025-01-18",
  },
  {
    id: "pay2",
    appointmentId: "a2",
    patientId: "patient1",
    patientName: "John Patient",
    doctorId: "d6",
    doctorName: "Dr. Michael Torres",
    amount: 500,
    transactionId: "TXN-2025-002B7G",
    paymentDate: "2025-01-13",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "px1",
    doctorId: "d1",
    patientId: "patient1",
    patientName: "John Patient",
    appointmentId: "a2",
    diagnosis: "Hypertension Stage 1",
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily" },
    ],
    notes: "Reduce salt intake. Exercise 30 minutes daily. Follow-up in 4 weeks.",
    createdAt: "2025-01-15",
  },
];

export const platformStats = {
  totalDoctors: 150,
  totalPatients: 2500,
  totalAppointments: 8900,
  totalReviews: 3200,
};

export const allUsers = [
  { id: "u1", name: "John Patient", email: "patient@demo.com", role: "patient", status: "active", createdAt: "2024-09-01", phone: "+1 555-0101", gender: "Male" },
  { id: "u2", name: "Alice Smith", email: "alice.smith@email.com", role: "patient", status: "active", createdAt: "2024-10-15", phone: "+1 555-0102", gender: "Female" },
  { id: "u3", name: "Bob Johnson", email: "bob.johnson@email.com", role: "patient", status: "suspended", createdAt: "2024-08-20", phone: "+1 555-0103", gender: "Male" },
  { id: "u4", name: "Dr. Sarah Mitchell", email: "doctor@demo.com", role: "doctor", status: "active", createdAt: "2024-07-10", phone: "+1 555-0201", gender: "Female" },
  { id: "u5", name: "Dr. David Park", email: "david.park@medicare.com", role: "doctor", status: "active", createdAt: "2024-11-05", phone: "+1 555-0202", gender: "Male" },
];

export const analyticsData = {
  appointmentsPerMonth: [
    { month: "Jul", appointments: 420 },
    { month: "Aug", appointments: 580 },
    { month: "Sep", appointments: 510 },
    { month: "Oct", appointments: 680 },
    { month: "Nov", appointments: 720 },
    { month: "Dec", appointments: 650 },
    { month: "Jan", appointments: 810 },
  ],
  doctorPerformance: [
    { name: "Dr. Priya Sharma", rating: 4.9, patients: 231 },
    { name: "Dr. Sarah Mitchell", rating: 4.9, patients: 187 },
    { name: "Dr. Fatima Al-Rashid", rating: 4.9, patients: 203 },
    { name: "Dr. James Okafor", rating: 4.8, patients: 142 },
    { name: "Dr. Amina Hassan", rating: 4.8, patients: 118 },
  ],
  revenuePerMonth: [
    { month: "Jul", revenue: 210000 },
    { month: "Aug", revenue: 290000 },
    { month: "Sep", revenue: 255000 },
    { month: "Oct", revenue: 340000 },
    { month: "Nov", revenue: 360000 },
    { month: "Dec", revenue: 325000 },
    { month: "Jan", revenue: 405000 },
  ],
  specializationDistribution: [
    { name: "General Medicine", value: 42 },
    { name: "Pediatrics", value: 31 },
    { name: "Cardiology", value: 24 },
    { name: "Orthopedics", value: 21 },
    { name: "Gynecology", value: 19 },
    { name: "Others", value: 13 },
  ],
};
