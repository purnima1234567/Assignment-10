import { motion } from "motion/react";
import { Target, Eye, Award, Users, Clock, Shield, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { platformStats } from "./mockData";

const values = [
  { icon: Heart, title: "Patient-First Care", desc: "Every decision we make centers on improving patient outcomes and experiences." },
  { icon: Shield, title: "Trusted & Secure", desc: "Your health data is protected with enterprise-grade security and encryption." },
  { icon: Clock, title: "24/7 Availability", desc: "Healthcare access whenever you need it, round the clock, every day of the year." },
  { icon: Award, title: "Verified Doctors", desc: "All doctors on our platform undergo rigorous credential verification." },
];

const team = [
  { name: "Dr. Eleanor Hayes", role: "Chief Medical Officer", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&auto=format" },
  { name: "Marcus Rivera", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format" },
  { name: "Dr. Anita Kapoor", role: "Head of Partnerships", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&auto=format" },
  { name: "James Liu", role: "CTO & Co-Founder", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format" },
];

const stats = [
  { value: `${platformStats.totalDoctors}+`, label: "Verified Doctors" },
  { value: `${(platformStats.totalPatients / 1000).toFixed(0)}K+`, label: "Patients Served" },
  { value: `${(platformStats.totalAppointments / 1000).toFixed(0)}K+`, label: "Appointments Completed" },
  { value: "50+", label: "Cities Covered" },
];

export function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d2137] to-[#1565c0] text-white pt-28 pb-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1 bg-white/10 border border-white/20 rounded-full text-sm mb-5">
              About MediCare Connect
            </span>
            <h1
              className="text-white mb-5"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Redefining Healthcare<br />
              <span style={{ color: "#93c5fd" }}>Access for Everyone</span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              We believe quality healthcare is a right, not a privilege. MediCare Connect bridges the gap between patients and exceptional doctors through technology and compassion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-primary" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>{s.value}</p>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&h=500&fit=crop&auto=format"
              alt="Healthcare team"
              className="rounded-2xl w-full object-cover shadow-xl"
              style={{ height: "400px" }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower every individual with instant access to quality healthcare by seamlessly connecting patients with verified, compassionate doctors through an intuitive digital platform.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A world where geography, time zones, and bureaucracy no longer stand between people and the healthcare they deserve. We envision a future where every appointment is just a tap away.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Our Story</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Founded in 2020 by a team of doctors and technologists who experienced firsthand the friction in the healthcare system. We set out to build the platform we wished existed.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-3" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
            Meet Our Leadership
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">The dedicated team driving MediCare Connect's vision forward.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-4 inline-block">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-28 h-28 rounded-2xl object-cover mx-auto border-4 border-secondary"
                />
              </div>
              <h3 className="text-foreground text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{member.name}</h3>
              <p className="text-muted-foreground text-xs mt-0.5">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-white mb-4" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}>
            Join the MediCare Connect Family
          </h2>
          <p className="text-white/70 mb-8">
            Whether you're a patient looking for care or a doctor wanting to expand your practice, we're here for you.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/doctors" className="px-6 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
