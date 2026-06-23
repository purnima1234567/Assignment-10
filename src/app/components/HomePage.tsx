import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Search, Star, Clock, ChevronRight, MapPin, ArrowRight,
  Shield, Smartphone, Users, Award, Calendar, FileText
} from "lucide-react";
import { specializations, reviews } from "./mockData";
import { api } from "../services/api";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const step = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); } else { setCount(Math.floor(current)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

const whyChooseUs = [
  { icon: Shield, title: "Verified Doctors", desc: "All doctors are thoroughly vetted with credential checks, license verification, and peer reviews before joining." },
  { icon: Smartphone, title: "Easy Online Booking", desc: "Book appointments in under 2 minutes from any device. No waiting, no phone queues." },
  { icon: Calendar, title: "Flexible Scheduling", desc: "Choose from hundreds of available time slots that fit your busy life, including evenings and weekends." },
  { icon: FileText, title: "Digital Health Records", desc: "Access your complete medical history, prescriptions, and lab results securely from anywhere." },
  { icon: Users, title: "Multi-Specialty Network", desc: "Connect with specialists across 50+ medical disciplines from a single integrated platform." },
  { icon: Award, title: "Award-Winning Care", desc: "Recognized by healthcare institutions for excellence in patient satisfaction and clinical outcomes." },
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredDoctors, setFeaturedDoctors] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDoctors: 150,
    totalPatients: 2500,
    totalAppointments: 8900,
    totalReviews: 3200,
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const API_BASE = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";
        const res = await fetch(`${API_BASE}/doctors`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeaturedDoctors(data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();

    api.analytics.stats().then((res) => {
      if (res) {
        setStats({
          totalDoctors: res.totalDoctors || 0,
          totalPatients: res.totalPatients || 0,
          totalAppointments: res.totalAppointments || 0,
          totalReviews: res.totalReviews || 0,
        });
      }
    }).catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop&auto=format"
            alt="Healthcare professionals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2137]/90 via-[#0d2137]/70 to-[#1565c0]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white text-sm mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              150+ Verified Doctors Online Now
            </motion.div>
            <h1
              className="text-white mb-5 leading-tight"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              Your Health,{" "}
              <span style={{ color: "#93c5fd" }}>Our Priority.</span>
              <br />Book a Doctor Today.
            </h1>
            <p className="text-white/75 text-lg mb-8 leading-relaxed">
              Connect with top-rated doctors across 50+ specializations. Book appointments, manage records, and get expert care — all in one place.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 flex-col sm:flex-row max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, specializations..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-foreground text-sm outline-none border-2 border-transparent focus:border-primary"
                />
              </div>
              <Link
                to={`/doctors${searchQuery ? `?q=${searchQuery}` : ""}`}
                className="px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap justify-center"
              >
                Find Doctor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 mt-8">
              {[
                { value: "150+", label: "Doctors" },
                { value: "50+", label: "Specializations" },
                { value: "2,500+", label: "Happy Patients" },
              ].map((s) => (
                <div key={s.label} className="text-white">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.25rem" }}>{s.value}</p>
                  <p className="text-white/60 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Medical Specializations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1 bg-secondary text-primary rounded-full text-sm font-semibold mb-3">
              Browse by Specialty
            </span>
            <h2 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
              Medical Specializations
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Find the right specialist for your specific health needs
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {specializations.map((spec, i) => (
            <motion.div
              key={spec.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/doctors?specialization=${spec.name}`}
                className="group block p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-3">{spec.icon}</div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{spec.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{spec.count} doctors</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="bg-gradient-to-r from-[#0d2137] to-[#1565c0] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { end: stats.totalDoctors, suffix: "+", label: "Verified Doctors", icon: <i className="fa-solid fa-user-doctor text-[#60a5fa]"></i> },
              { end: stats.totalPatients, suffix: "+", label: "Patients Served", icon: <i className="fa-solid fa-users text-[#60a5fa]"></i> },
              { end: stats.totalAppointments, suffix: "+", label: "Appointments", icon: <i className="fa-regular fa-calendar-check text-[#60a5fa]"></i> },
              { end: stats.totalReviews, suffix: "+", label: "Patient Reviews", icon: <i className="fa-solid fa-star text-[#fbbf24]"></i> },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2.5rem" }}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1 bg-secondary text-primary rounded-full text-sm font-semibold mb-3">
              Top Rated
            </span>
            <h2 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
              Featured Doctors
            </h2>
            <p className="text-muted-foreground mt-1">Highly rated specialists trusted by thousands of patients</p>
          </motion.div>
          <Link
            to="/doctors"
            className="hidden sm:flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDoctors.map((doc, i) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/doctors/${doc._id}`} className="group block bg-white rounded-2xl border border-border hover:shadow-lg transition-all overflow-hidden">
                <div className="relative h-56 bg-secondary overflow-hidden">
                  <img
                    src={doc.profileImage}
                    alt={doc.doctorName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{doc.rating}</span>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-semibold text-white">Verified</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{doc.doctorName}</h3>
                  <p className="text-primary text-sm font-medium mt-0.5">{doc.specialization}</p>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    {doc.hospitalName}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {doc.experience} yrs exp
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {doc.reviewCount} reviews
                      </div>
                    </div>
                    <p className="text-sm font-bold text-primary">${doc.consultationFee}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link to="/doctors" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline text-sm">
            View All Doctors <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Patient Success Stories */}
      <section className="bg-muted py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1 bg-white text-primary rounded-full text-sm font-semibold mb-3 border border-border">
                Patient Stories
              </span>
              <h2 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
                What Our Patients Say
              </h2>
              <p className="text-muted-foreground mt-2">Real experiences from real patients who transformed their health.</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{review.reviewText}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img src={review.patientPhoto} alt={review.patientName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.patientName}</p>
                    <p className="text-xs text-muted-foreground">Patient of {review.doctorName}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1 bg-secondary text-primary rounded-full text-sm font-semibold mb-3">
              Our Advantages
            </span>
            <h2 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
              Why Choose MediCare Connect?
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              We go beyond appointment booking to deliver a complete, end-to-end healthcare experience.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 bg-fixed bg-center bg-cover bg-no-repeat mt-12" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop&auto=format")' }}>
        <div className="absolute inset-0 bg-[#0d2137]/90 backdrop-blur-[2px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-white mb-6 leading-tight" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-white/80 mb-8 text-lg leading-relaxed max-w-lg">
                Join over 2,500 patients who've improved their healthcare journey with MediCare Connect. Expert care is just a few clicks away.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-lg shadow-primary/30"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/doctors"
                  className="px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Browse Doctors
                </Link>
              </div>
            </motion.div>

            {/* Image Content */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137] to-transparent z-10 rounded-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800&h=800&fit=crop&auto=format" 
                alt="Medical Professionals" 
                className="rounded-3xl border border-white/10 shadow-2xl relative z-0 object-cover h-[400px] w-full"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-border">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">150+ Experts</p>
                  <p className="text-xs text-muted-foreground">Available Online</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
