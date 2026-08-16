import {
  Image,
  SmilePlus,
  MapPin,
  PenLine,
  Globe2,
  Send,
  X,
  Loader2,
  Navigation,
} from "lucide-react";

import { UserContext } from "../../context/UserContext";
import { useContext, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CreatePost() {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Location
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Feeling
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);

  const feelings = [
    { emoji: "😀", label: "Happy" },
    { emoji: "😍", label: "Loved" },
    { emoji: "😂", label: "Funny" },
    { emoji: "🥰", label: "Cute" },
    { emoji: "😎", label: "Cool" },
    { emoji: "🤩", label: "Excited" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "🥳", label: "Celebrating" },
    { emoji: "🤔", label: "Thinking" },
    { emoji: "😴", label: "Sleepy" },
    { emoji: "🔥", label: "Motivated" },
    { emoji: "❤️", label: "Loved" },
    { emoji: "💔", label: "Heartbroken" },
    { emoji: "🙏", label: "Thankful" },
    { emoji: "💪", label: "Strong" },
  ];

  // =========================
  // Create Post
  // =========================
  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("body", body);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        "https://route-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Post created successfully!");

      setBody("");
      setImage(null);
      setPreview("");
      setShowFeelingPicker(false);

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getProfilePosts"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create post"
      );
    },
  });

  // =========================
  // Select Image
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // Remove Image
  // =========================
  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  // =========================
  // Add Feeling
  // =========================
  const handleFeeling = (feeling) => {
    setBody((prev) => {
      const currentText = prev.trim();

      if (!currentText) {
        return `${feeling.emoji} ${feeling.label}`;
      }

      return `${currentText} ${feeling.emoji}`;
    });

    setShowFeelingPicker(false);
  };

  // =========================
  // Get Location
  // =========================
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const { data } = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
              },
              headers: {
                Accept: "application/json",
              },
            }
          );

          const locationName =
            data?.display_name ||
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

          setBody((prev) => {
            const currentText = prev.trim();

            if (!currentText) {
              return `📍 ${locationName}`;
            }

            return `${currentText}\n📍 ${locationName}`;
          });

          toast.success("Location added to your post");
        } catch (error) {
          const fallbackLocation = `${latitude.toFixed(
            5
          )}, ${longitude.toFixed(5)}`;

          setBody((prev) => {
            const currentText = prev.trim();

            if (!currentText) {
              return `📍 ${fallbackLocation}`;
            }

            return `${currentText}\n📍 ${fallbackLocation}`;
          });

          toast.success("Location coordinates added");
        } finally {
          setIsGettingLocation(false);
        }
      },

      (error) => {
        setIsGettingLocation(false);

        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission was denied");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("Location is currently unavailable");
        } else if (error.code === error.TIMEOUT) {
          toast.error("Location request timed out");
        } else {
          toast.error("Unable to get your location");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!body.trim()) {
      toast.error("Please write something first");
      return;
    }

    createPostMutation.mutate();
  };

  return (
    <div className="mb-10 flex flex-col gap-7">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs font-semibold">
            <PenLine size={14} />
            Create Post
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Share something with your community
          </h1>

          <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl leading-6">
            Share your thoughts, updates, or anything you want your friends
            and community to see.
          </p>
        </div>

        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-16 -bottom-20 w-56 h-56 rounded-full bg-pink-500/10 blur-2xl" />
      </div>

      {/* Create Post Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="p-5 sm:p-6">
          {/* User */}
          <div className="flex items-center gap-3">
            <img
              src={userData?.photo}
              alt="User avatar"
              className="w-12 h-12 rounded-2xl object-cover ring-4 ring-blue-50"
            />

            <div>
              <h2 className="font-bold text-slate-900">
                {userData?.name}
              </h2>

              <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Globe2 size={13} />
                Public
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="mt-5">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm sm:text-base text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={preview}
                alt="Post preview"
                className="w-full max-h-96 object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Add to your post
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

              {/* Photo */}
              <label
                htmlFor="post-image"
                className="cursor-pointer flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition"
              >
                <Image size={18} />
                Photo / Video
              </label>

              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Feeling */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setShowFeelingPicker((prev) => !prev)
                  }
                  className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white hover:text-purple-600 hover:shadow-sm transition"
                >
                  <SmilePlus size={18} />
                  Feeling
                </button>

                {showFeelingPicker && (
                  <div className="absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Choose a feeling
                        </h3>

                        <p className="text-xs text-slate-400 mt-0.5">
                          Pick an emoji for your post
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setShowFeelingPicker(false)
                        }
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {feelings.map((feeling) => (
                        <button
                          key={feeling.emoji + feeling.label}
                          type="button"
                          onClick={() => handleFeeling(feeling)}
                          className="group flex flex-col items-center justify-center gap-1 rounded-xl p-2 hover:bg-purple-50 transition"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {feeling.emoji}
                          </span>

                          <span className="text-[10px] font-medium text-slate-400 group-hover:text-purple-600">
                            {feeling.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white hover:text-pink-500 hover:shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin size={18} />
                    Check In
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe2 size={14} />
              <span>
                Your post will be visible to everyone
              </span>
            </div>

            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Post
                  <Send size={17} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}