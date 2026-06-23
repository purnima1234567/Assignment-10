import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Stethoscope, AlertCircle, Info } from "lucide-react";
import { useAuth } from "./AuthContext";
import { motion } from "motion/react";

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed.");
    }
  };

  const quickLogin = (email: string) => {
    setForm({ email, password: "Demo@123" });
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccessMsg("Google login successful! Redirecting...");
    const result = await login("patient@demo.com", "Demo@123");
    if (result.success) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setError("Google Login failed (mock)");
      setSuccessMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f6ff] to-[#e3f2fd] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.75rem" }}>
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your MediCare Connect account</p>
          </div>

          {/* Demo accounts */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs font-semibold text-blue-700">Demo Accounts (password: Demo@123)</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Patient", email: "patient@demo.com" },
                { label: "Doctor", email: "doctor@demo.com" },
              ].map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc.email)}
                  className="text-xs py-1.5 px-2 rounded-lg bg-white border border-blue-200 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
              <Info className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email / Username</label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com or username"
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
                  placeholder="••••••••"
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
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-muted-foreground">or</span></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
