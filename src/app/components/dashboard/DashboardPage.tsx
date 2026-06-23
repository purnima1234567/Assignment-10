import { useState } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Calendar, CreditCard, Star, User, Stethoscope, Users, BarChart2,
  FileText, Menu, X, LogOut, ChevronRight
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { PatientDashboard } from "./PatientDashboard";
import { DoctorDashboard } from "./DoctorDashboard";
import { AdminDashboard } from "./AdminDashboard";

const navItems = {
  patient: [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Calendar, label: "My Appointments" },
    { icon: CreditCard, label: "Payment History" },
    { icon: Star, label: "My Reviews" },
    { icon: User, label: "My Profile" },
  ],
  doctor: [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Calendar, label: "Appointment Requests" },
    { icon: Calendar, label: "Manage Schedule" },
    { icon: FileText, label: "Prescriptions" },
    { icon: User, label: "Profile" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Users, label: "Manage Users" },
    { icon: Stethoscope, label: "Manage Doctors" },
    { icon: Calendar, label: "Appointments" },
    { icon: CreditCard, label: "Payments" },
    { icon: BarChart2, label: "Analytics" },
  ],
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">Please log in to access your dashboard.</p>
          <Link to="/login" className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const roleTitle = { patient: "Patient Dashboard", doctor: "Doctor Dashboard", admin: "Admin Dashboard" }[user.role];

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-16 flex items-center px-4 gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-foreground hidden sm:block" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
            MediCare<span style={{ color: "var(--primary)" }}>Connect</span>
          </span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-xl object-cover border-2 border-secondary" />
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 overflow-y-auto flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Role badge */}
          <div className="px-4 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-xl object-cover border-2 border-sidebar-primary/30" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4">
            <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-widest px-3 mb-3">Navigation</p>
            <ul className="space-y-1">
              {(navItems[user.role] || navItems.patient).map((item) => (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === item.label
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                    onClick={() => {
                      setActiveTab(item.label);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-3 py-4 border-t border-sidebar-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors mb-1"
            >
              <Stethoscope className="w-4 h-4" /> Back to Site
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>
                {roleTitle}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">Welcome back, {user.name.split(" ")[0]}! 👋</p>
            </div>

            {user.role === "patient" && <PatientDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />}
            {user.role === "doctor" && <DoctorDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />}
            {user.role === "admin" && <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}
