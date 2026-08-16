import NavBar from "../NavBar/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function MainLayout() {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <NavBar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}