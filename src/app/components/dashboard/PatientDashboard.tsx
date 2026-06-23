import { useState, useEffect } from "react";
import { Calendar, CreditCard, Star, User, Clock, CheckCircle, XCircle, Trash2, Edit3, Plus, Loader2 } from "lucide-react";
import { api } from "../../services/api";

const tabs = ["Overview", "My Appointments", "Payment History", "My Reviews", "My Profile"];

export function PatientDashboard({ user, activeTab, setActiveTab }: { user: { id: string; name: string; email: string; photo: string; phone: string }, activeTab: string, setActiveTab: (t: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [reviewForm, setReviewForm] = useState({ doctorId: "", rating: 5, text: "" });
  const [editingReview, setEditingReview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, paysRes, revsRes, docsRes] = await Promise.all([
          api.appointments.list(),
          api.payments.list(),
          api.reviews.list(),
          api.doctors.list()
        ]);
        // Note: our backend returns { doctors: [...] } for doctors if paginated, otherwise array.
        const docsData = Array.isArray(docsRes) ? docsRes : (docsRes as any).doctors || [];
        
        setAppointments(apptsRes.filter((a: any) => a.patientId === user.id));
        setPayments(paysRes.filter((p: any) => p.patientId === user.id));
        setReviews(revsRes.filter((r: any) => r.patientId === user.id));
        setDoctors(docsData);
      } catch (err) {
        console.error("Error fetching patient dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const upcoming = appointments.filter((a) => a.appointmentStatus === "confirmed" || a.appointmentStatus === "pending");
  const completed = appointments.filter((a) => a.appointmentStatus === "completed");

  const handleReviewSubmit = async () => {
    if (!reviewForm.text.trim() || !reviewForm.doctorId) return;
    try {
      const doc = doctors.find(d => d._id === reviewForm.doctorId);
      if (editingReview) {
        const res = await api.reviews.update(editingReview, { rating: reviewForm.rating, reviewText: reviewForm.text });
        setReviews(reviews.map(r => r._id === editingReview ? res : r));
        setEditingReview(null);
      } else {
        const payload = {
          patientId: user.id,
          doctorId: reviewForm.doctorId,
          rating: reviewForm.rating,
          reviewText: reviewForm.text,
        };
        const res = await api.reviews.create(payload);
        // append locally
        setReviews([res, ...reviews]);
      }
      setReviewForm({ doctorId: "", rating: 5, text: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete review?")) return;
    try {
      await api.reviews.delete(id);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const cancelAppointment = async (id: string) => {
    if (!confirm("Cancel appointment?")) return;
    try {
      const res = await api.appointments.updateStatus(id, "cancelled");
      setAppointments(appointments.map(a => a._id === id ? res : a));
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-8" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Upcoming", value: upcoming.length, color: "bg-blue-100 text-blue-600" },
              { icon: CheckCircle, label: "Completed", value: completed.length, color: "bg-green-100 text-green-600" },
              { icon: CreditCard, label: "Total Paid", value: `$${payments.reduce((s, p) => s + p.amount, 0)}`, color: "bg-purple-100 text-purple-600" },
              { icon: Star, label: "Reviews Given", value: reviews.length, color: "bg-yellow-100 text-yellow-600" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>{card.value}</p>
                <p className="text-muted-foreground text-sm">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Upcoming Appointments</h3>
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No upcoming appointments.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div key={appt._id} className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{appt.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{appt.doctorSpecialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{appt.appointmentDate}</p>
                      <p className="text-xs text-muted-foreground">{appt.appointmentTime}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[appt.appointmentStatus]}`}>
                      {appt.appointmentStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Appointments */}
      {activeTab === "My Appointments" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>All Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["Doctor", "Specialization", "Date & Time", "Status", "Payment", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{appt.doctorName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{appt.doctorSpecialization}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <div>{appt.appointmentDate}</div>
                      <div className="text-xs">{appt.appointmentTime}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[appt.appointmentStatus]}`}>
                        {appt.appointmentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${appt.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {appt.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {appt.appointmentStatus !== "cancelled" && appt.appointmentStatus !== "completed" && (
                          <button onClick={() => cancelAppointment(appt._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Cancel">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History */}
      {activeTab === "Payment History" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Payment Records</h3>
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-bold text-foreground">${payments.reduce((s, p) => s + p.amount, 0)}</span>
            </p>
          </div>
          {payments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No payment records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {["Transaction ID", "Doctor", "Amount", "Date", "Status"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((pay) => (
                    <tr key={pay._id} className="hover:bg-muted/40">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{pay.transactionId}</td>
                      <td className="px-5 py-4 text-foreground font-medium">{pay.doctorName}</td>
                      <td className="px-5 py-4 font-bold text-primary">${pay.amount}</td>
                      <td className="px-5 py-4 text-muted-foreground">{pay.paymentDate}</td>
                      <td className="px-5 py-4"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">Paid</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* My Reviews */}
      {activeTab === "My Reviews" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
              {editingReview ? "Edit Review" : "Write a Review"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Doctor</label>
                <select
                  value={reviewForm.doctorId}
                  onChange={(e) => setReviewForm({ ...reviewForm, doctorId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm bg-background outline-none focus:border-primary"
                >
                  <option value="">Select doctor...</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.doctorName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => setReviewForm({ ...reviewForm, rating: r })}>
                      <Star className={`w-6 h-6 transition-colors ${r <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1.5">Review</label>
              <textarea
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                rows={3}
                placeholder="Share your experience..."
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-background outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReviewSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {editingReview ? "Update" : "Submit Review"}
              </button>
              {editingReview && (
                <button
                  onClick={() => { setEditingReview(null); setReviewForm({ doctorId: "", rating: 5, text: "" }); }}
                  className="px-5 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {doctors.find(d => d._id === review.doctorId)?.doctorName || "Doctor"}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingReview(review._id); setReviewForm({ doctorId: review.doctorId, rating: review.rating, text: review.reviewText }); }}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{review.reviewText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Profile */}
      {activeTab === "My Profile" && (
        <div className="bg-white rounded-2xl border border-border p-8">
          <div className="flex items-center gap-5 mb-8">
            <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-secondary" />
            <div>
              <h2 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>{user.name}</h2>
              <p className="text-muted-foreground text-sm capitalize">Patient</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Full Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Account Status", value: "Active" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{field.label}</label>
                <input
                  type="text"
                  readOnly
                  defaultValue={field.value}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-sm outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
