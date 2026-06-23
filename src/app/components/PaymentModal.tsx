import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { X, CreditCard, Loader2 } from "lucide-react";
import { api } from "../services/api";

// Use Stripe test key for assignment purposes
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function CheckoutForm({ amount, appointmentData, onSuccess, onClose }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    api.payments.createIntent(amount).then((res) => {
      setClientSecret(res.clientSecret);
    });
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
        billing_details: {
          name: appointmentData.patientName,
        },
      },
    });

    if (paymentError) {
      setError(paymentError.message || "An unexpected error occurred.");
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Create the appointment first
      try {
        const appointmentRes = await api.appointments.create({
          ...appointmentData,
          paymentStatus: "paid",
          amount,
        });

        // Then confirm payment in DB
        await api.payments.confirm({
          appointmentId: appointmentRes._id,
          patientId: appointmentData.patientId,
          patientName: appointmentData.patientName,
          doctorId: appointmentData.doctorId,
          doctorName: appointmentData.doctorName,
          amount,
          transactionId: paymentIntent.id,
        });

        onSuccess();
      } catch (err: any) {
        setError(err.message || "Failed to save appointment data.");
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-xl border border-border">
        <label className="text-sm font-medium text-foreground mb-2 block">Card Details</label>
        <div className="p-3 bg-background border border-border rounded-lg">
          <CardElement options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }} />
        </div>
      </div>

      {error && <div className="text-sm text-destructive font-medium">{error}</div>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Pay ${amount}
        </button>
      </div>
    </form>
  );
}

export function PaymentModal({ amount, appointmentData, onSuccess, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-background rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold font-nunito text-foreground">Confirm Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-muted-foreground">Consultation Fee</span>
            <span className="text-xl font-bold text-foreground">${amount}</span>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} appointmentData={appointmentData} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        </div>
      </motion.div>
    </div>
  );
}
