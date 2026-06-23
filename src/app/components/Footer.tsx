import { Link } from "react-router";
import { Stethoscope, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
                MediCare<span style={{ color: "#60a5fa" }}>Connect</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Connecting patients with world-class doctors through a seamless, secure digital healthcare platform.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Find Doctors", to: "/doctors" },
                { label: "About Us", to: "/about" },
                { label: "Contact Us", to: "/contact" },
                { label: "Sign In", to: "/login" },
                { label: "Register", to: "/register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Specializations</h4>
            <ul className="space-y-2.5">
              {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General Medicine"].map(
                (spec) => (
                  <li key={spec}>
                    <Link
                      to={`/doctors?specialization=${spec}`}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {spec}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">
                  MediCare Tower, 45 Health Avenue, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-white/60">+1 (800) 555-CARE</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-white/60">support@medicareconnect.com</span>
              </li>
            </ul>
            <div className="mt-5 bg-red-600/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">🚨 Emergency Hotline</p>
              <p className="text-lg font-bold text-white">+1 (911) 555-HELP</p>
              <p className="text-xs text-white/50 mt-0.5">Available 24/7 for emergencies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} MediCare Connect. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
