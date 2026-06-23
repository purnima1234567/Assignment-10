import { useState, useEffect } from "react";
import { Calendar, Users, Star, FileText, CheckCircle, XCircle, FilePlus, Edit3, Loader2 } from "lucide-react";
import { api } from "../../services/api";

const tabs = ["Overview", "Appointment Requests", "Manage Schedule", "Prescriptions", "Profile"];

const mockSchedule = [
  { id: "s1", day: "Monday", slots: ["09:00 AM", "10:00 AM", "02:00 PM"] },
  { id: "s2", day: "Wednesday", slots: ["10:00 AM", "11:30 AM", "03:00 PM", "04:30 PM"] },
  { id: "s3", day: "Friday", slots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"] },
];

export function DoctorDashboard({ user, activeTab, setActiveTab }: { user: { id: string; name: string; email: string; photo: string; phone: string }, activeTab: string, setActiveTab: (t: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [appts, setAppts] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);

  const [schedule, setSchedule] = useState(mockSchedule);
  const [newDay, setNewDay] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const [prescriptionForm, setPrescriptionForm] = useState({ appointmentId: "", patientId: "", patientName: "", diagnosis: "", medications: [{ name: "", dosage: "", frequency: "" }], notes: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, presRes, revsRes, docsRes] = await Promise.all([
          api.appointments.list(),
          api.prescriptions.list(),
          api.reviews.list(),
          api.doctors.list()
        ]);
        
        const docsData = Array.isArray(docsRes) ? docsRes : (docsRes as any).doctors || [];
        const myDocProfile = docsData.find((d: any) => d.email === user.email);
        setDoctorProfile(myDocProfile);

        if (myDocProfile) {
          setAppts(apptsRes.filter((a: any) => a.doctorId === myDocProfile._id));
          setPrescriptions(presRes.filter((p: any) => p.doctorId === myDocProfile._id));
          setReviews(revsRes.filter((r: any) => r.doctorId === myDocProfile._id));
        }
      } catch (err) {
        console.error("Error fetching doctor data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.email]);

  const updateApptStatus = async (id: string, status: string) => {
    try {
      const res = await api.appointments.updateStatus(id, status);
      setAppts(appts.map(a => a._id === id ? res : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePrescription = async () => {
    if (!prescriptionForm.appointmentId || !doctorProfile) return;
    try {
      const payload = {
        ...prescriptionForm,
        doctorId: doctorProfile._id
      };
      const res = await api.prescriptions.create(payload);
      setPrescriptions([res, ...prescriptions]);
      setPrescriptionForm({ appointmentId: "", patientId: "", patientName: "", diagnosis: "", medications: [{ name: "", dosage: "", frequency: "" }], notes: "" });
      setActiveTab("Prescriptions");
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequests = appts.filter(a => a.appointmentStatus === "pending");
  const todayAppts = appts.filter(a => a.appointmentStatus === "confirmed");
  const uniquePatients = new Set(appts.map(a => a.patientId)).size;

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
              { icon: Users, label: "Total Patients", value: uniquePatients, color: "bg-blue-100 text-blue-600" },
              { icon: Calendar, label: "Today's Appts", value: todayAppts.length, color: "bg-green-100 text-green-600" },
              { icon: Star, label: "Reviews", value: reviews.length, color: "bg-yellow-100 text-yellow-600" },
              { icon: FileText, label: "Prescriptions", value: prescriptions.length, color: "bg-purple-100 text-purple-600" },
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

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Pending Requests</h3>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">No pending requests right now.</div>
            ) : (
              <div className="divide-y divide-border">
                {pendingRequests.map((req) => (
                  <div key={req._id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{req.patientName}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{req.appointmentDate} • {req.appointmentTime}</span>
                          <span className="capitalize">{req.symptoms || "General"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateApptStatus(req._id, "confirmed")} className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button onClick={() => updateApptStatus(req._id, "cancelled")} className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Requests & Management */}
      {activeTab === "Appointment Requests" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>All Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["Patient", "Date & Time", "Status", "Payment", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appts.map((appt) => (
                  <tr key={appt._id} className="hover:bg-muted/40">
                    <td className="px-5 py-4 font-medium text-foreground">{appt.patientName}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <div>{appt.appointmentDate}</div>
                      <div className="text-xs">{appt.appointmentTime}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        appt.appointmentStatus === "confirmed" ? "bg-blue-100 text-blue-700" :
                        appt.appointmentStatus === "completed" ? "bg-green-100 text-green-700" :
                        appt.appointmentStatus === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
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
                        {appt.appointmentStatus === "confirmed" && (
                          <button
                            onClick={() => updateApptStatus(appt._id, "completed")}
                            className="px-3 py-1.5 bg-secondary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                        {appt.appointmentStatus === "completed" && (
                          <button
                            onClick={() => {
                              setPrescriptionForm(prev => ({ ...prev, appointmentId: appt._id, patientId: appt.patientId, patientName: appt.patientName }));
                              setActiveTab("Prescriptions");
                            }}
                            className="p-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors" title="Write Prescription"
                          >
                            <FilePlus className="w-4 h-4" />
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

      {/* Manage Schedule (Keep static mock behavior for assignment requirement to 'manage schedule' since we don't have a schedule DB collection yet) */}
      {activeTab === "Manage Schedule" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Add New Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none focus:border-primary">
                <option value="">Select Day</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="time" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none focus:border-primary" />
              <button
                onClick={() => {
                  if (newDay && newSlot) {
                    const existing = schedule.find(s => s.day === newDay);
                    if (existing) {
                      setSchedule(schedule.map(s => s.day === newDay ? { ...s, slots: [...s.slots, newSlot].sort() } : s));
                    } else {
                      setSchedule([...schedule, { id: Date.now().toString(), day: newDay, slots: [newSlot] }]);
                    }
                    setNewSlot("");
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Add Slot
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-border p-5">
                <h4 className="font-bold text-foreground mb-3">{s.day}</h4>
                <div className="flex flex-wrap gap-2">
                  {s.slots.map(slot => (
                    <div key={slot} className="group relative px-3 py-1 bg-secondary text-primary rounded-md text-xs font-medium cursor-pointer">
                      {slot}
                      <button
                        onClick={() => setSchedule(schedule.map(sc => sc.day === s.day ? { ...sc, slots: sc.slots.filter(sl => sl !== slot) } : sc).filter(sc => sc.slots.length > 0))}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescriptions */}
      {activeTab === "Prescriptions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Write Prescription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Select Patient / Appointment</label>
                <select
                  value={prescriptionForm.appointmentId}
                  onChange={(e) => {
                    const appt = appts.find(a => a._id === e.target.value);
                    if (appt) {
                      setPrescriptionForm({ ...prescriptionForm, appointmentId: appt._id, patientId: appt.patientId, patientName: appt.patientName });
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none focus:border-primary"
                >
                  <option value="">Select an appointment...</option>
                  {appts.filter(a => a.appointmentStatus === "completed").map(a => (
                    <option key={a._id} value={a._id}>{a.patientName} - {a.appointmentDate}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                  placeholder="e.g. Viral Fever"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center justify-between">
                <span>Medications</span>
                <button
                  onClick={() => setPrescriptionForm({ ...prescriptionForm, medications: [...prescriptionForm.medications, { name: "", dosage: "", frequency: "" }] })}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  + Add Medicine
                </button>
              </label>
              <div className="space-y-2">
                {prescriptionForm.medications.map((med, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" placeholder="Medicine Name" value={med.name} onChange={(e) => { const newMeds = [...prescriptionForm.medications]; newMeds[i].name = e.target.value; setPrescriptionForm({ ...prescriptionForm, medications: newMeds }) }} className="flex-1 px-3 py-2 border border-border rounded-lg text-xs" />
                    <input type="text" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => { const newMeds = [...prescriptionForm.medications]; newMeds[i].dosage = e.target.value; setPrescriptionForm({ ...prescriptionForm, medications: newMeds }) }} className="w-24 px-3 py-2 border border-border rounded-lg text-xs" />
                    <input type="text" placeholder="Freq (1-0-1)" value={med.frequency} onChange={(e) => { const newMeds = [...prescriptionForm.medications]; newMeds[i].frequency = e.target.value; setPrescriptionForm({ ...prescriptionForm, medications: newMeds }) }} className="w-24 px-3 py-2 border border-border rounded-lg text-xs" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Additional Notes</label>
              <textarea
                value={prescriptionForm.notes}
                onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none focus:border-primary resize-none"
              />
            </div>
            
            <button
              onClick={handleCreatePrescription}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Save Prescription
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground font-bold font-nunito mt-6">Recent Prescriptions</h3>
            {prescriptions.map((pres) => (
              <div key={pres._id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{pres.patientName}</p>
                    <p className="text-sm text-primary font-medium">{pres.diagnosis}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(pres.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-muted p-3 rounded-xl mb-3">
                  <ul className="space-y-1">
                    {pres.medications.map((m: any, i: number) => (
                      <li key={i} className="text-sm flex gap-4">
                        <span className="font-medium min-w-[120px]">{m.name}</span>
                        <span className="text-muted-foreground">{m.dosage}</span>
                        <span className="text-muted-foreground">{m.frequency}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {pres.notes && <p className="text-sm text-muted-foreground italic">Note: {pres.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Management */}
      {activeTab === "Profile" && doctorProfile && (
        <div className="bg-white rounded-2xl border border-border p-8">
          <div className="flex items-center gap-5 mb-8">
            <img src={doctorProfile.profileImage} alt={doctorProfile.doctorName} className="w-20 h-20 rounded-2xl object-cover border-4 border-secondary" />
            <div>
              <h2 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>{doctorProfile.doctorName}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${doctorProfile.verificationStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {doctorProfile.verificationStatus === "verified" ? "Verified" : "Pending Verification"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Specialization", value: doctorProfile.specialization },
              { label: "Consultation Fee", value: `$${doctorProfile.consultationFee}` },
              { label: "Hospital", value: doctorProfile.hospitalName },
              { label: "Experience", value: `${doctorProfile.experience} Years` },
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
