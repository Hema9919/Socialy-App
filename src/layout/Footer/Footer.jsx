import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-center">
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span>© {new Date().getFullYear()} Socialy</span>

            <span className="w-1 h-1 rounded-full bg-slate-300" />

            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-500" />

              <span>Design by</span>

              <span className="font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                HeMa
              </span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}