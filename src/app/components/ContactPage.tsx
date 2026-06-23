import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  { icon: Phone, title: "Phone", value: "+1 (800) 555-CARE", sub: "Mon–Sat, 8am–8pm EST" },
  { icon: Mail, title: "Email", value: "support@medicareconnect.com", sub: "We reply within 24 hours" },
  { icon: MapPin, title: "Address", value: "45 Health Avenue, Suite 200", sub: "New York, NY 10001" },
  { icon: Clock, title: "Business Hours", value: "Monday – Friday", sub: "8:00 AM – 6:00 PM EST" },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email.";
    if (!form.subject.trim()) errs.subject = "Subject is required.";
    if (form.message.trim().length < 20) errs.message = "Message must be at least 20 characters.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d2137] to-[#1565c0] text-white pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 bg-white/10 border border-white/20 rounded-full text-sm mb-5">
              Get In Touch
            </span>
            <h1
              className="text-white mb-4"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              Contact Us
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Have questions about our services? Our friendly team is always here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-foreground mb-6" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
              Reach Out To Us
            </h2>
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{info.title}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{info.value}</p>
                  <p className="text-xs text-muted-foreground">{info.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Emergency */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-sm font-bold text-red-700 mb-1">🚨 Medical Emergency?</p>
              <p className="text-2xl font-black text-red-600">+1 (911) 555-HELP</p>
              <p className="text-xs text-red-500 mt-1">Available 24 hours, 7 days a week</p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-card rounded-2xl border border-border p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.25rem" }}>
                    Send Us a Message
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-foreground mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Smith"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-foreground mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-1.5">Subject *</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors focus:border-primary ${errors.subject ? "border-red-400" : "border-border"}`}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-1.5">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      placeholder="Please describe your inquiry in detail..."
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors focus:border-primary resize-none ${errors.message ? "border-red-400" : "border-border"}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
