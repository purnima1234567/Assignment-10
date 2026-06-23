import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Star, Clock, MapPin, Award, Calendar, ChevronLeft, CheckCircle, X } from "lucide-react";
import { motion } from "motion/react";
import { reviews } from "./mockData";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";
import { PaymentModal } from "./PaymentModal";

export function DoctorDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [booked, setBooked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.doctors.list();
        const docsData = Array.isArray(res) ? res : (res as any).doctors || [];
        const found = docsData.find((d: any) => d._id === id || d.id === id);
        setDoc(found);
        
        const revs = await api.reviews.list();
        setReviewsList(revs.filter((r: any) => r.doctorId === (found?._id || found?.id)));
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Doctor Not Found</h2>
          <Link to="/doctors" className="text-primary hover:underline text-sm">Browse all doctors</Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) { window.location.href = "/login"; return; }
    if (!selectedDay || !selectedSlot) { return; }
    setShowBooking(false);
    setShowPayment(true);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link>
            <span>/</span>
            <span className="text-foreground">{doc.doctorName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-[#0d2137] to-[#1565c0]">
                <div className="absolute -bottom-16 left-8">
                  <img
                    src={doc.profileImage}
                    alt={doc.doctorName}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                  />
                </div>
                {doc.verificationStatus === "verified" && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 rounded-full">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Verified</span>
                  </div>
                )}
              </div>
              <div className="pt-20 pb-6 px-8">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>
                      {doc.doctorName}
                    </h1>
                    <p className="text-primary font-semibold mt-0.5">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {doc.hospitalName}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>
                      ${doc.consultationFee}
                    </p>
                    <p className="text-muted-foreground text-xs">per consultation</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <p className="text-primary" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>{doc.experience}+</p>
                    <p className="text-muted-foreground text-xs">Years Experience</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <p className="text-primary" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>{doc.rating}</p>
                    </div>
                    <p className="text-muted-foreground text-xs">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-primary" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>{doc.reviewCount}</p>
                    <p className="text-muted-foreground text-xs">Reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>About</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{doc.about}</p>

              <h3 className="text-foreground mt-6 mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {doc.qualifications.map((q) => (
                  <span key={q} className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg text-sm text-primary font-medium">
                    <Award className="w-3.5 h-3.5" />
                    {q}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-foreground mb-6" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>
                Patient Reviews ({reviewsList.length})
              </h2>
              <div className="space-y-5">
                {reviewsList.slice(0, 4).map((review) => (
                  <div key={review._id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary">{review.patientName?.[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="text-sm font-semibold text-foreground">{review.patientName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5 mb-2">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.reviewText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-foreground mb-5" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1.125rem" }}>
                  Book an Appointment
                </h2>

                {/* Available Days */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Days</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.availableDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedDay === day ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-secondary hover:text-primary"}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Slots</p>
                  <div className="grid grid-cols-2 gap-2">
                    {doc.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${selectedSlot === slot ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-secondary hover:text-primary"}`}
                      >
                        <Clock className="w-3 h-3" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowBooking(true)}
                  disabled={!selectedDay || !selectedSlot}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Payment required to confirm booking
                </p>
              </motion.div>

              {/* Back to list */}
              <Link to="/doctors" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to all doctors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-border w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1.125rem" }}>
                Confirm Appointment Details
              </h3>
              <button onClick={() => setShowBooking(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
                <div className="bg-muted rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doctor</span>
                    <span className="font-semibold text-foreground">{doc.doctorName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Day</span>
                    <span className="font-semibold text-foreground">{selectedDay}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold text-foreground">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                    <span className="text-muted-foreground">Consultation Fee</span>
                    <span className="font-bold text-primary">${doc.consultationFee}</span>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Symptoms / Reason for visit</label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe your symptoms..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                {!user && (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
                    Please <Link to="/login" className="font-semibold underline">log in</Link> to book an appointment.
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBooking(false)}
                    className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </div>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={doc.consultationFee}
          appointmentData={{
            patientId: user.id,
            patientName: user.name,
            doctorId: doc._id || doc.id,
            doctorName: doc.doctorName,
            doctorSpecialization: doc.specialization,
            appointmentDate: selectedDay,
            appointmentTime: selectedSlot,
            symptoms: symptoms,
          }}
          onSuccess={() => {
            setShowPayment(false);
            setBooked(true);
            setTimeout(() => { setBooked(false); setSelectedSlot(""); setSelectedDay(""); setSymptoms(""); }, 3000);
          }}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Success Modal */}
      {booked && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-border w-full max-w-md p-6"
          >
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
                  Appointment Booked!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your appointment with {doc.doctorName} on {selectedDay} at {selectedSlot} has been successfully paid and confirmed.
                </p>
              </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
