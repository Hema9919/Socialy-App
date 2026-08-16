import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-[#11163d] to-[#241044] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-180px] left-[-180px] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-180px] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl">
        {/* Icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
          <SearchX
            size={42}
            className="text-blue-400"
          />
        </div>

        {/* 404 */}
        <h1 className="text-[110px] sm:text-[140px] leading-none font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-400 mt-4 leading-relaxed max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or may have
          been moved to another place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/home"
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white/10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/15 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Brand */}
        <p className="mt-10 text-sm text-slate-500">
          Socialy{" "}
          <span className="text-blue-400">•</span>{" "}
          <span className="text-purple-400">Share</span>{" "}
          <span className="text-pink-400">•</span>{" "}
          Connect & Explore
        </p>
      </div>
    </div>
  );
}