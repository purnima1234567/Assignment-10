import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "your_stripe_test_key_here");

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { appointmentId, transactionId, amount, patientId, patientName, doctorId, doctorName } = req.body;
    const payment = new Payment({
      appointmentId, patientId, patientName, doctorId, doctorName, amount, transactionId, paymentDate: new Date().toISOString().split("T")[0]
    });
    await payment.save();
    
    await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: "paid" });
    
    res.status(201).json({ message: "Payment successful", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
