import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Edit3,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PostCard from "../../components/PostCard/PostCard";

export default function Profile() {
  const { userData } = useContext(UserContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [passwords, setPasswords] = useState({
    password: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // =========================
  // Get User Posts
  // =========================
  const getProfilePosts = async () => {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/users/${userData?._id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["getProfilePosts", userData?._id],
    queryFn: getProfilePosts,
    enabled: !!userData?._id,
  });

  // =========================
  // Change Password
  // =========================
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: passwords.password,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    },

    onSuccess: (response) => {
      toast.success("Password changed successfully");

      // لو الـ API رجع token جديد
      const newToken =
        response?.token ||
        response?.data?.token ||
        response?.data?.accessToken;

      if (newToken) {
        localStorage.setItem("token", newToken);
      }

      setPasswords({
        password: "",
        newPassword: "",
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    },
  });

  // =========================
  // Upload Profile Photo
  // =========================
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    },

    onSuccess: () => {
      toast.success("Profile photo updated successfully");
      setPhoto(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload profile photo"
      );
    },
  });

  // =========================
  // Loading
  // =========================
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 animate-pulse">
          <div className="h-44 bg-slate-200" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
              <div className="w-32 h-32 rounded-full bg-slate-300 ring-4 ring-white" />

              <div className="space-y-2 mb-2 text-center sm:text-left">
                <div className="h-6 w-40 bg-slate-200 rounded-lg" />
                <div className="h-4 w-52 bg-slate-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="h-20 border-t border-slate-100 bg-slate-50" />
        </div>

        <div className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <h3 className="text-base font-bold text-red-600">
            Failed to load profile posts
          </h3>

          <p className="mt-2 text-sm text-red-400">
            Something went wrong while loading your posts.
          </p>
        </div>
      </div>
    );
  }

  const posts = data?.data?.posts || [];

  // =========================
  // Submit Password
  // =========================
  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!passwords.password || !passwords.newPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    changePasswordMutation.mutate();
  };

  // =========================
  // Select Photo
  // =========================
  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setPhoto(selectedFile);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* Profile Header */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg">
          {/* Cover */}
          <div className="relative h-44 overflow-hidden bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-white/5" />

            <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-pink-500/10 blur-2xl" />
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 -mt-16">
              {/* User */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="relative">
                  <img
                    src={userData?.photo}
                    alt={userData?.name || "Profile Avatar"}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
                  />

                  <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white" />
                </div>

                <div className="mb-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {userData?.name || "Social App User"}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    @{userData?.username || "username"}
                  </p>
                </div>
              </div>

              {/* Edit */}
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="mb-2 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/70">
            <div className="py-4 text-center border-r border-slate-100">
              <p className="text-lg font-bold text-slate-900">
                {userData?.followersCount ?? 0}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Followers
              </p>
            </div>

            <div className="py-4 text-center">
              <p className="text-lg font-bold text-slate-900">
                {userData?.followingCount ?? 0}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Following
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm">
          <h3 className="text-base font-bold text-slate-800">
            Welcome to your personal profile!
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Here you can view your personal details, manage your account
            settings, and browse your created posts.
          </p>
        </div>

        {/* Posts Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Posts</h2>

            <p className="mt-1 text-sm text-slate-400">
              Posts you have shared with your community.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {posts.length} {posts.length === 1 ? "Post" : "Posts"}
          </span>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">
              No Posts Yet
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              You haven't shared any posts yet.
            </p>
          </div>
        )}
      </div>

      {/* =========================
          Edit Profile Modal
      ========================= */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4 py-6"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your password or profile picture.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-7">
              {/* =========================
                  Profile Photo
              ========================= */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Camera size={18} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Profile Photo
                    </h3>

                    <p className="text-xs text-slate-400">
                      Upload a new profile picture
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="shrink-0">
                      <img
                        src={
                          photo
                            ? URL.createObjectURL(photo)
                            : userData?.photo
                        }
                        alt="Profile preview"
                        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <label
                        htmlFor="profile-photo"
                        className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-600 transition"
                      >
                        <Upload size={17} />
                        Choose Image
                      </label>

                      <input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />

                      <p className="mt-2 text-xs text-slate-400">
                        {photo ? photo.name : "PNG, JPG or WEBP"}
                      </p>

                      {photo && (
                        <button
                          type="button"
                          onClick={() =>
                            uploadPhotoMutation.mutate(photo)
                          }
                          disabled={uploadPhotoMutation.isPending}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          {uploadPhotoMutation.isPending ? (
                            <>
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={17} />
                              Upload Photo
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* =========================
                  Change Password
              ========================= */}
              <form onSubmit={handleChangePassword}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Lock size={18} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Change Password
                    </h3>

                    <p className="text-xs text-slate-400">
                      Keep your account secure.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.password}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60 transition"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}