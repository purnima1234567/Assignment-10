import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <svg viewBox="0 0 400 300" className="w-full max-w-sm mx-auto" fill="none">
            <circle cx="200" cy="140" r="100" fill="#E3F2FD" />
            <circle cx="200" cy="140" r="70" fill="#BBDEFB" />
            <text x="200" y="160" textAnchor="middle" fontSize="60" fontWeight="bold" fill="#1565C0">
              404
            </text>
            <path d="M120 240 Q200 280 280 240" stroke="#1565C0" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="160" cy="120" r="8" fill="#1565C0" />
            <circle cx="240" cy="120" r="8" fill="#1565C0" />
            <path d="M80 50 L90 70 L100 50" stroke="#00897B" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M300 60 L310 80 L320 60" stroke="#1565C0" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="350" cy="100" r="12" fill="#E3F2FD" stroke="#1565C0" strokeWidth="2" />
            <text x="350" y="105" textAnchor="middle" fontSize="14">+</text>
          </svg>
        </div>
        <h1
          className="text-foreground mb-3"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "2rem" }}
        >
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have taken a day off. Let's get you back to health — and back home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>
          <Link
            to="/doctors"
            className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
          >
            <Search className="w-4 h-4" />
            Find a Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}
