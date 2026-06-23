# MediCare Connect 🩺

MediCare Connect is a modern healthcare management platform that bridges the gap between patients, doctors, and hospital administrators. Built with a responsive and accessible design, it allows users to seamlessly book appointments, manage medical records, process secure payments, and receive world-class healthcare services online.

## 🚀 Features

- **Dynamic Dashboards**: Dedicated role-based dashboards for Patients, Doctors, and Administrators.
- **Appointment Booking**: Find doctors by specialization, view availability, and book appointments instantly.
- **Secure Payments**: Integrated with Stripe for seamless, encrypted payment processing.
- **Real-time Analytics**: Dynamic platform statistics tracking doctors, patients, appointments, and reviews.
- **Responsive UI/UX**: Built with Tailwind CSS, Shadcn UI, and Framer Motion for a stunning, modern, and engaging experience.
- **Secure Authentication**: JWT-based authentication ensuring data privacy and secure access control.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, FontAwesome
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & bcrypt
- **Payments**: Stripe API

## 💻 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a MongoDB Atlas URI)
- Stripe API Keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jasminaramim/MediCareConnect.git
   cd MediCareConnect
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

### Environment Variables
Create a `.env` file in the `server` directory and add your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend application:**
   ```bash
   # From the root directory
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## 🎨 Design System
MediCare Connect utilizes a comprehensive design system focused on accessibility and vibrant, premium aesthetics, specifically tailored for healthcare environments.

## 📄 License
This project is for demonstration and assignment purposes.