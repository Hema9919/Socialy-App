import { useContext, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginschema } from "./../../schema/loginShema";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Auth } from "./../../context/AuthContext";

export default function Login() {
  // auth context
  const { setToken } = useContext(Auth);
  const [showPassword, setShowPassword] = useState(false);
  // navigate
  let navigate = useNavigate();
  //loading
  const [loading, setLoading] = useState(false);
  //Get data from form
  let { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(loginschema),
  });
  function submitForm(data) {
    setLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signin", data)
      .then((resp) => {
        if (resp.data.message == "signed in successfully") {
          navigate("/home");
          setToken(resp.data.data.token);
          localStorage.setItem("token", resp.data.data.token);
          toast.success(resp.data.message);
          console.log("ok1");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log("ok2");
      })
      .finally(() => {
        setLoading(false);
        console.log("ok3");
      });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-[#11163d] to-[#241044] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-150px] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />

      {/* Main Card */}
      <div className="relative w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid md:grid-cols-2">
            {/* Left Side */}
            <div className="hidden md:flex relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-10 text-white flex-col justify-between overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
              <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-pink-500/20 rounded-full" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                  <Sparkles size={28} />
                </div>

                <h1 className="text-4xl font-bold leading-tight">
                  Welcome
                  <span className="block text-pink-300">back.</span>
                </h1>

                <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                  Stay connected with your community, discover new posts, and
                  share what matters to you.
                </p>
              </div>

              {/* Bottom */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <LogIn size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Welcome to Socialy</p>

                    <p className="text-xs text-blue-200">
                      Share • Connect • Explore
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="p-6 sm:p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                {/* Mobile Icon */}
                <div className="md:hidden w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                  <LogIn size={24} />
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome Back
                </h2>

                <p className="text-slate-500 mt-2">
                  Login to continue to your account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      {...register("email")}
                      type="email"
                      placeholder="bahnasyd20222@gmail.com"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                  {formState.errors.email && formState.touchedFields.email ? (
                    <p className=" text-red-700">
                      {formState.errors.email?.message}
                    </p>
                  ) : null}
                </div>
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formState.errors.password &&
                  formState.touchedFields.password ? (
                    <p className=" text-red-700">
                      {formState.errors.password?.message}
                    </p>
                  ) : null}
                </div>

                {/* Remember Me */}
                {/* <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-500 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div> */}

                {/* Login Button */}
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  <LogIn size={19} />
                  {loading ? "Loading..." : "Login"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-slate-200 flex-1" />

                  <span className="text-xs text-slate-400">OR</span>

                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                {/* Sign Up */}
                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-purple-600 transition"
                  >
                    <UserPlus size={15} />
                    Create Account
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
