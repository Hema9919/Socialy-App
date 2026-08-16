import { useContext, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  LogOut,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";

import { Auth } from "../../context/AuthContext";

export default function NavBar() {
  const { setToken } = useContext(Auth);
  const navigate = useNavigate();

  // =========================
  // Dark Mode
  // =========================
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between">

          {/* =========================
              Logo + Navigation
          ========================= */}
          <div className="flex items-center gap-6 sm:gap-10">

            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles size={20} />
              </div>

              <div className="hidden sm:block">
                <h1 className="font-bold text-xl tracking-tight bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Socialy
                </h1>

                <p className="text-[10px] text-slate-400 dark:text-slate-500 -mt-1">
                  Share • Connect • Explore
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-1.5">

              {/* Home */}
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Home size={18} />
                <span className="hidden sm:block">Home</span>
              </NavLink>

              {/* Profile */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <User size={18} />
                <span className="hidden sm:block">Profile</span>
              </NavLink>
            </div>
          </div>

          {/* =========================
              Actions
          ========================= */}
          <div className="flex items-center gap-2">

            {/* Divider */}
            <div className="hidden sm:block w-px h-7 bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Dark / Light */}
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}