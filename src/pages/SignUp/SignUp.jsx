import { useState,useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  AtSign,
  Mail,
  Calendar,
  VenusAndMars,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
//Vallidation
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./../../schema/registerShema";
import { useNavigate } from "react-router-dom";
import { Auth } from './../../context/AuthContext';
export default function SignUp() {
    const {setToken} = useContext(Auth)
  
  //pass
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  // navigate
  let navigate = useNavigate();
  //loading
  const [loading, setLoading] = useState(false);

  //Get data from form
  let { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
  });
  function submitForm(data) {
    setLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signup", data)
      .then((resp) => {
        if (resp.data.message == "account created") {
          navigate("/home");
          setToken(resp.data.data.token)
          localStorage.setItem("token", resp.data.data.token);
          toast.success(resp.data.message);
        }
        // console.log(resp);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        // console.log(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
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
              {/* Decorative Circles */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
              <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-pink-500/20 rounded-full" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                  <UserPlus size={28} />
                </div>

                <h1 className="text-4xl font-bold leading-tight">
                  Join the
                  <span className="block text-pink-300">community.</span>
                </h1>

                <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                  Create your account and start sharing your thoughts,
                  connecting with people, and discovering new posts.
                </p>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Your social space</p>
                    <p className="text-xs text-blue-200">
                      Share • Connect • Explore
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-8">
                <div className="md:hidden w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                  <UserPlus size={24} />
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Create Account
                </h2>

                <p className="text-slate-500 mt-2">
                  Join us and start your social journey.
                </p>
              </div>

              <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
                {/* Name + Username */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Ahmed Bahnasy"
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                    {formState.errors.name && formState.touchedFields.name ? (
                      <p className=" text-red-700">
                        {formState.errors.name?.message}
                      </p>
                    ) : null}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Username
                    </label>

                    <div className="relative">
                      <AtSign
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        {...register("username")}
                        placeholder="Bahnasy202222"
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      />
                    </div>
                    {formState.errors.username &&
                    formState.touchedFields.username ? (
                      <p className=" text-red-700">
                        {formState.errors.username?.message}
                      </p>
                    ) : null}
                  </div>
                </div>

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

                {/* Date + Gender */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date of Birth
                    </label>

                    <div className="relative">
                      <Calendar
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        {...register("dateOfBirth")}
                        type="date"
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-600"
                      />
                    </div>
                    {formState.errors.dateOfBirth &&
                    formState.touchedFields.dateOfBirth ? (
                      <p className=" text-red-700">
                        {formState.errors.dateOfBirth?.message}
                      </p>
                    ) : null}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Gender
                    </label>

                    <div className="relative">
                      <VenusAndMars
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        {...register("gender")}
                        defaultValue=""
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-600 appearance-none"
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    {formState.errors.gender &&
                    formState.touchedFields.gender ? (
                      <p className=" text-red-700">
                        {formState.errors.gender?.message}
                      </p>
                    ) : null}
                  </div>
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      {...register("rePassword")}
                      type={showRePassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showRePassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {formState.errors.rePassword &&
                  formState.touchedFields.rePassword ? (
                    <p className=" text-red-700">
                      {formState.errors.rePassword?.message}
                    </p>
                  ) : null}
                </div>

                {/* Submit */}
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  <UserPlus size={19} />
                  {loading ? "Loading..." : "Create Account"}
                </button>
                {/* Login */}
                <p className="text-center text-sm text-slate-500 pt-2">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-purple-600 transition"
                  >
                    Login
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
