import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Stethoscope, AlertCircle, CheckCircle, User, Stethoscope as DocIcon } from "lucide-react";
import { useAuth } from "./AuthContext";
import { motion } from "motion/react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains a special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const score = checks.filter((c) => c.valid).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score] : "bg-muted"}`} />
        ))}
      </div>
      <div className="space-y-0.5">
        {checks.map((c) => (
          <div key={c.label} className={`flex items-center gap-1.5 text-xs ${c.valid ? "text-green-600" : "text-muted-foreground"}`}>
            <CheckCircle className={`w-3 h-3 ${c.valid ? "text-green-500" : "text-muted"}`} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" as "patient" | "doctor", phone: "", photo: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isPasswordValid = form.password.length >= 6 && /\d/.test(form.password) && /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError("Enter a valid email address."); return; }
    if (!isPasswordValid) { setError("Password must be at least 6 characters with a number and special character."); return; }
    const result = await register(form);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      setError(result.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f6ff] to-[#e3f2fd] flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Join thousands of patients and doctors</p>
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "patient", label: "Patient", icon: User, desc: "Book appointments" },
              { value: "doctor", label: "Doctor", icon: DocIcon, desc: "Manage consultations" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm({ ...form, role: r.value as "patient" | "doctor" })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  form.role === r.value ? "border-primary bg-secondary" : "border-border hover:border-primary/40"
                }`}
              >
                <r.icon className={`w-5 h-5 mb-1.5 ${form.role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-sm font-semibold ${form.role === r.value ? "text-primary" : "text-foreground"}`}>{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-sm text-green-700">Account created successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Photo URL</label>
              <input
                type="url"
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && <PasswordStrength password={form.password} />}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
