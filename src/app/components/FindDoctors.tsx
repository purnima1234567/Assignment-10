import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, Star, Clock, MapPin, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../services/api";
import { specializations } from "./mockData";
import type { Doctor } from "./mockData";

const PAGE_SIZE = 6;

export function FindDoctors() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get("specialization") || "");
  const [sortBy, setSortBy] = useState<"fee" | "experience" | "rating" | "">("rating");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.doctors.list({
          page,
          limit: PAGE_SIZE,
          search: query,
          specialization: selectedSpec,
          sort: sortBy,
        });
        
        if (res.doctors) {
          setDoctorsList(res.doctors);
          setTotalPages(res.totalPages || 1);
          setTotalDoctors(res.total || res.doctors.length);
        } else if (Array.isArray(res)) {
          setDoctorsList(res);
          setTotalPages(Math.ceil(res.length / PAGE_SIZE));
          setTotalDoctors(res.length);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const timeoutId = setTimeout(() => fetchDoctors(), 300);
    return () => clearTimeout(timeoutId);
  }, [query, selectedSpec, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedSpec, sortBy]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d2137] to-[#1565c0] pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-white mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
              Find Your Doctor
            </h1>
            <p className="text-white/70">Search from {totalDoctors}+ specialists</p>
          </motion.div>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, specialization, hospital..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-sm text-foreground outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mt-4 bg-white rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Specialization</label>
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background outline-none focus:border-primary"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background outline-none focus:border-primary"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experienced</option>
                  <option value="fee">Lowest Fee</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Specialization tabs */}
      <div className="border-b border-border bg-white sticky top-16 z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setSelectedSpec("")}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedSpec ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              All
            </button>
            {specializations.slice(0, 8).map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedSpec(selectedSpec === s.name ? "" : s.name)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSpec === s.name ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            Showing <span className="font-semibold text-foreground">{totalDoctors}</span> doctors
            {selectedSpec && <> in <span className="font-semibold text-primary">{selectedSpec}</span></>}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background outline-none focus:border-primary"
            >
              <option value="rating">Sort: Rating</option>
              <option value="experience">Sort: Experience</option>
              <option value="fee">Sort: Fee (Low-High)</option>
            </select>
          </div>
        </div>

        {doctorsList.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>No doctors found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorsList.map((doc, i) => (
              <DoctorCard key={doc.id || doc._id} doc={doc} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary text-white" : "border border-border hover:bg-muted"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function DoctorCard({ doc, index }: { doc: Doctor; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={`/doctors/${(doc as any)._id || doc.id}`} className="group block bg-white rounded-2xl border border-border hover:shadow-lg transition-all overflow-hidden">
        <div className="relative h-52 bg-secondary overflow-hidden">
          <img
            src={doc.profileImage}
            alt={doc.doctorName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{doc.rating}</span>
          </div>
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500/90 rounded-full">
            <span className="text-xs font-semibold text-white">✓ Verified</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-foreground" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1rem" }}>{doc.doctorName}</h3>
          <p className="text-primary text-sm font-medium mt-0.5">{doc.specialization}</p>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{doc.hospitalName}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {doc.qualifications.slice(0, 2).map((q) => (
              <span key={q} className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">{q}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {doc.experience} yrs
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {doc.reviewCount} reviews
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">${doc.consultationFee}</p>
              <p className="text-xs text-muted-foreground">per visit</p>
            </div>
          </div>
          <button className="w-full mt-3 py-2 bg-secondary text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
            Book Appointment
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
