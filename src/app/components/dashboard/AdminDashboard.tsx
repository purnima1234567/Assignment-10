import { useState, useEffect } from "react";
import { Users, Stethoscope, Calendar, CreditCard, Trash2, CheckCircle, XCircle, Ban, BarChart2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { api } from "../../services/api";

const tabs = ["Overview", "Manage Users", "Manage Doctors", "Appointments", "Payments", "Analytics"];

const PIE_COLORS = ["#1565c0", "#00897b", "#7c3aed", "#ea580c", "#0284c7", "#6b7280"];

export function AdminDashboard({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [docList, setDocList] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, totalReviews: 0 });
  const [analyticsData, setAnalyticsData] = useState<any>({
    appointmentsPerMonth: [],
    revenuePerMonth: [],
    specializationDistribution: [],
    doctorPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role: "patient" });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [u, d, a, p, s, ad] = await Promise.all([
        api.users.list(),
        api.doctors.list(),
        api.appointments.list(),
        api.payments.list(),
        api.analytics.stats(),
        api.analytics.data(),
      ]);
      setUsers(u);
      setDocList(d);
      setAppointments(a);
      setPayments(p);
      setPlatformStats(s);
      setAnalyticsData(ad);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  const verifyDoctor = async (id: string, status: "verified" | "rejected") => {
    try {
      const updated = await api.doctors.verify(id, status);
      setDocList(docList.map(d => d._id === id ? { ...d, verificationStatus: updated.verificationStatus } : d));
    } catch (err) {
      console.error("Failed to verify doctor:", err);
    }
  };

  const updateUserStatus = async (id: string, status: "active" | "suspended") => {
    try {
      const updated = await api.users.updateStatus(id, status);
      setUsers(users.map(u => u._id === id ? { ...u, status: updated.status } : u));
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.users.delete(id);
      setUsers(users.filter(x => x._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Re-using the auth register endpoint to create users from admin panel
      const API_BASE = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      if (res.ok) {
        setShowAddUser(false);
        setNewUserForm({ name: "", email: "", password: "", role: "patient" });
        loadData(); // refresh list
      }
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-700",
    verified: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
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

      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Total Users", value: platformStats.totalPatients, color: "bg-blue-100 text-blue-600" },
              { icon: Stethoscope, label: "Total Doctors", value: platformStats.totalDoctors, color: "bg-purple-100 text-purple-600" },
              { icon: Calendar, label: "Total Appointments", value: platformStats.totalAppointments, color: "bg-green-100 text-green-600" },
              { icon: CreditCard, label: "Revenue (Jan)", value: "$405K", color: "bg-orange-100 text-orange-600" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
                  {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                </p>
                <p className="text-muted-foreground text-sm">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Appointments (Last 7 months)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analyticsData.appointmentsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#1565c0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Specialty Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analyticsData.specializationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {analyticsData.specializationDistribution.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Manage Users" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>All Users</h3>
            <button onClick={() => setShowAddUser(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90">
              + Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["User", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{u.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-primary capitalize">{u.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{u.createdAt?.slice(0, 10)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUserStatus(u._id, u.status === "active" ? "suspended" : "active")}
                          className={`p-1.5 rounded-lg transition-colors ${u.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                          title={u.status === "active" ? "Suspend" : "Activate"}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Manage Doctors" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Doctor Verification</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["Doctor", "Specialization", "Hospital", "Experience", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {docList.map((doc) => (
                  <tr key={doc._id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={doc.profileImage} alt={doc.doctorName} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-medium text-foreground">{doc.doctorName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.specialization}</td>
                    <td className="px-5 py-4 text-muted-foreground truncate max-w-32">{doc.hospitalName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.experience} yrs</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[doc.verificationStatus]}`}>
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {doc.verificationStatus === "pending" && (
                          <>
                            <button onClick={() => verifyDoctor(doc._id, "verified")} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Verify">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => verifyDoctor(doc._id, "rejected")} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {doc.verificationStatus === "verified" && (
                          <button onClick={() => verifyDoctor(doc._id, "rejected")} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
                            Revoke
                          </button>
                        )}
                        {doc.verificationStatus === "rejected" && (
                          <button onClick={() => verifyDoctor(doc._id, "verified")} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition-colors">
                            Approve
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

      {activeTab === "Appointments" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>All Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["Patient", "Doctor", "Date", "Status", "Payment"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-muted/40">
                    <td className="px-5 py-4 font-medium text-foreground">{appt.patientName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{appt.doctorName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{appt.appointmentDate} {appt.appointmentTime}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[appt.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}>
                        {appt.appointmentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${appt.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {appt.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Payments" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Payment Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["Transaction ID", "Patient", "Doctor", "Amount", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-muted/40">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{pay.transactionId}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{pay.patientName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{pay.doctorName}</td>
                    <td className="px-5 py-4 font-bold text-primary">${pay.amount}</td>
                    <td className="px-5 py-4 text-muted-foreground">{pay.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Doctors", value: platformStats.totalDoctors, change: "+12%", positive: true },
              { label: "Total Patients", value: platformStats.totalPatients.toLocaleString(), change: "+18%", positive: true },
              { label: "Total Appointments", value: platformStats.totalAppointments.toLocaleString(), change: "+24%", positive: true },
              { label: "Total Reviews", value: platformStats.totalReviews.toLocaleString(), change: "+31%", positive: true },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>{s.value}</p>
                <p className="text-green-600 text-xs font-medium mt-1">↑ {s.change} vs last year</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="text-foreground mb-5" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData.revenuePerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(0)}K`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#1565c0" strokeWidth={2.5} dot={{ fill: "#1565c0", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-foreground mb-5" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Monthly Appointments</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analyticsData.appointmentsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#00897b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-foreground mb-5" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Top Doctors by Rating</h3>
              <div className="space-y-3">
                {analyticsData.doctorPerformance.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{doc.name}</span>
                        <span className="text-xs font-bold text-primary">{doc.rating} ⭐</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(doc.rating / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.patients} patients</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-foreground">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={newUserForm.name} onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input required type="password" value={newUserForm.password} onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={newUserForm.role} onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
