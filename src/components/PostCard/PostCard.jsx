import { useContext, useState } from "react";
import {
  Bookmark,
  Clock3,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Send,
  Image as ImageIcon,
  X,
  Edit3,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { UserContext } from "../../context/UserContext";

export default function PostCard({ post }) {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // =========================
  // States
  // =========================
  const [comment, setComment] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [commentPreview, setCommentPreview] = useState("");

  const [showEditComment, setShowEditComment] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editCommentImage, setEditCommentImage] = useState(null);
  const [editCommentPreview, setEditCommentPreview] = useState("");
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] =
    useState(false);

  const [showDeletePostConfirm, setShowDeletePostConfirm] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [editPostBody, setEditPostBody] = useState(post.body || "");
  const [editPostImage, setEditPostImage] = useState(null);
  const [editPostPreview, setEditPostPreview] = useState("");

  // =========================
  // Dates
  // =========================
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(post.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // =========================
  // Current Comment / Post Owner
  // =========================
  const commentCreatorId = post.topComment?.commentCreator?._id;

  const isCommentOwner =
    userData?._id && commentCreatorId
      ? userData._id === commentCreatorId
      : false;

  const isPostOwner =
    userData?._id && post.user?._id ? userData._id === post.user._id : false;

  const invalidatePostQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["getProfilePosts"] });
    queryClient.invalidateQueries({ queryKey: ["singlePost", post.id] });
  };

  // ============================================================
  // CREATE COMMENT
  // ============================================================
  const createCommentMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("content", comment.trim());

      if (commentImage) {
        formData.append("image", commentImage);
      }

      const { data } = await axios.post(
        `https://route-posts.routemisr.com/posts/${post.id}/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Comment added successfully");

      setComment("");
      setCommentImage(null);
      setCommentPreview("");
      invalidatePostQueries();
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    },
  });

  // ============================================================
  // UPDATE COMMENT
  // ============================================================
  const updateCommentMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("content", editComment.trim());

      if (editCommentImage) {
        formData.append("image", editCommentImage);
      }

      const { data } = await axios.put(
        `https://route-posts.routemisr.com/posts/${post.id}/comments/${post.topComment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Comment updated successfully");

      setShowEditComment(false);
      setEditComment("");
      setEditCommentImage(null);
      setEditCommentPreview("");
      invalidatePostQueries();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update comment",
      );
    },
  });

  // ============================================================
  // DELETE COMMENT
  // ============================================================
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `https://route-posts.routemisr.com/posts/${post.id}/comments/${post.topComment._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Comment deleted successfully");

      setShowDeleteCommentConfirm(false);
      invalidatePostQueries();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete comment",
      );
    },
  });

  // ============================================================
  // COMMENT IMAGE
  // ============================================================
  const handleCommentImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setCommentImage(file);
    setCommentPreview(URL.createObjectURL(file));
  };

  const removeCommentImage = () => {
    setCommentImage(null);
    setCommentPreview("");
  };

  // ============================================================
  // EDIT COMMENT
  // ============================================================
  const openEditComment = () => {
    setEditComment(post.topComment?.content || "");
    setEditCommentImage(null);
    setEditCommentPreview("");
    setShowEditComment(true);
  };

  const handleEditCommentImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setEditCommentImage(file);
    setEditCommentPreview(URL.createObjectURL(file));
  };

  // ============================================================
  // SUBMIT COMMENT
  // ============================================================
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Write a comment first");
      return;
    }

    createCommentMutation.mutate();
  };

  const handleEditCommentSubmit = (e) => {
    e.preventDefault();

    if (!editComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    updateCommentMutation.mutate();
  };

  // ============================================================
  // UPDATE POST
  // ============================================================
  const updatePostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("body", editPostBody.trim());

      if (editPostImage) {
        formData.append("image", editPostImage);
      }

      const { data } = await axios.put(
        `https://route-posts.routemisr.com/posts/${post.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Post updated successfully");
      setShowEditPost(false);
      setEditPostImage(null);
      setEditPostPreview("");
      invalidatePostQueries();
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update post");
    },
  });

  // ============================================================
  // DELETE POST
  // ============================================================
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `https://route-posts.routemisr.com/posts/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Post deleted successfully");
      setShowPostMenu(false);
      setShowDeletePostConfirm(false);
      invalidatePostQueries();
      navigate("/home");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete post");
    },
  });

  // ============================================================
  // EDIT POST IMAGE / OPEN EDIT
  // ============================================================
  const handleEditPostImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setEditPostImage(file);
    setEditPostPreview(URL.createObjectURL(file));
  };

  const openEditPost = (e) => {
    e.stopPropagation();

    setEditPostBody(post.body || "");
    setEditPostImage(null);
    setEditPostPreview(post.image || "");
    setShowEditPost(true);
    setShowPostMenu(false);
  };

  // ============================================================
  // LIKE / UNLIKE
  // ============================================================
  const likePostMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(
        `https://route-posts.routemisr.com/posts/${post.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["getProfilePosts"] });
      queryClient.invalidateQueries({ queryKey: ["singlePost", post.id] });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to like post");
    },
  });

  return (
    <article className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white mb-10 w-full rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 overflow-hidden">
      {/* ======================================================
          POST HEADER
      ======================================================= */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* User */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={post.user?.photo}
                alt={post.user?.name || "User"}
                className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-white" />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 truncate">
                {post.user?.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                <span className="truncate">@{post.user?.username}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <Clock3 size={13} />
                <span className="whitespace-nowrap">
                  {formattedDate} · {formattedTime}
                </span>
              </div>
            </div>
          </div>

          {/* More */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPostMenu((prev) => !prev);
              }}
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <MoreHorizontal size={20} />
            </button>

            {showPostMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-11 z-30 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
              >
                {isPostOwner && (
                  <>
                    <button
                      type="button"
                      onClick={openEditPost}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Edit3 size={16} />
                      Edit Post
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPostMenu(false);
                        setShowDeletePostConfirm(true);
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={16} />
                      Delete Post
                    </button>
                  </>
                )}

                <Link
                  to={`/posts/${post.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <MoreHorizontal size={16} />
                  View Post
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            POST CONTENT
        ======================================================= */}
        <div className="mt-5 space-y-4">
          <p className="text-slate-700 text-[15px] sm:text-base leading-7 whitespace-pre-wrap break-words">
            {post.body}
          </p>

          {post.image && (
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img
                src={post.image}
                alt="Post"
                className="w-full max-h-150 object-contain bg-slate-50"
              />
            </div>
          )}
        </div>

        {/* Privacy */}
        <div className="mt-4 inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-500 capitalize">
          {post.privacy}
        </div>
      </div>

      {/* ======================================================
          STATS
      ======================================================= */}
      <div className="px-5 sm:px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              {post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}
            </span>
            <span>
              {post.commentsCount}{" "}
              {post.commentsCount === 1 ? "Comment" : "Comments"}
            </span>
          </div>

          <span>
            {post.sharesCount} {post.sharesCount === 1 ? "Share" : "Shares"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 sm:mx-6 border-t border-slate-100" />

      {/* ======================================================
          POST ACTIONS
      ======================================================= */}
      <div className="px-3 sm:px-4 py-3 flex items-center gap-1">
        {/* Like */}
        <button
          type="button"
          onClick={() => likePostMutation.mutate()}
          disabled={likePostMutation.isPending}
          className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all disabled:opacity-50"
        >
          <Heart
            size={19}
            className={
              post.likesCount > 0 ? "fill-rose-500 text-rose-500" : ""
            }
          />
          <span className="hidden sm:block text-sm font-semibold">Like</span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => {
            document.getElementById(`comment-${post.id}`)?.focus();
          }}
          className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
        >
          <MessageCircle size={19} />
          <span className="hidden sm:block text-sm font-semibold">
            Comment
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition-all"
        >
          <Share2 size={19} />
          <span className="hidden sm:block text-sm font-semibold">Share</span>
        </button>

        {/* Bookmark */}
        <button
          type="button"
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            post.bookmarked
              ? "bg-amber-50 text-amber-500"
              : "text-slate-400 hover:bg-amber-50 hover:text-amber-500"
          }`}
        >
          <Bookmark
            size={19}
            className={post.bookmarked ? "fill-current" : ""}
          />
        </button>
      </div>

      {/* ======================================================
          ADD COMMENT
      ======================================================= */}
      <div className="px-5 sm:px-6 pb-5">
        <form onSubmit={handleCommentSubmit}>
          <div className="flex items-start gap-3">
            <img
              src={userData?.photo}
              alt={userData?.name || "You"}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
            />

            <div className="flex-1">
              <div className="relative">
                <textarea
                  id={`comment-${post.id}`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="Write a comment..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <label
                  htmlFor={`comment-image-${post.id}`}
                  className="absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition"
                >
                  <ImageIcon size={17} />
                </label>

                <input
                  id={`comment-image-${post.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleCommentImageChange}
                  className="hidden"
                />
              </div>

              {/* Image Preview */}
              {commentPreview && (
                <div className="relative mt-3 w-fit overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={commentPreview}
                    alt="Comment preview"
                    className="w-28 h-20 object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeCommentImage}
                    className="absolute top-1 right-1 w-6 h-6 rounded-md bg-black/60 text-white flex items-center justify-center"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={createCommentMutation.isPending || !comment.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createCommentMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Comment
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ======================================================
          TOP COMMENT
      ======================================================= */}
      {post.topComment && (
        <div className="mx-5 sm:mx-6 mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <img
              src={post.topComment.commentCreator?.photo}
              alt={post.topComment.commentCreator?.name || "Comment creator"}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      {post.topComment.commentCreator?.name}
                    </p>
                    <span className="text-xs text-slate-400">
                      @{post.topComment.commentCreator?.username}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {new Date(post.topComment.createdAt).toLocaleString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                {isCommentOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={openEditComment}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 transition"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeleteCommentConfirm(true)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <p className="text-sm text-slate-600 leading-6 break-words">
                  {post.topComment.content}
                </p>
              </div>

              {post.topComment.image && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img
                    src={post.topComment.image}
                    alt="Comment"
                    className="max-h-60 w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          EDIT COMMENT MODAL
      ======================================================= */}
      {showEditComment && post.topComment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
          onClick={() => setShowEditComment(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Comment
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update your comment.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditComment(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditCommentSubmit} className="p-6">
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <label
                htmlFor={`edit-comment-image-${post.id}`}
                className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition"
              >
                <ImageIcon size={18} />
                Change Image
                <input
                  id={`edit-comment-image-${post.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleEditCommentImageChange}
                  className="hidden"
                />
              </label>

              {editCommentPreview && (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={editCommentPreview}
                    alt="Comment preview"
                    className="w-full max-h-60 object-contain bg-slate-50"
                  />
                </div>
              )}

              {editCommentImage && (
                <p className="mt-2 text-xs text-slate-400">
                  {editCommentImage.name}
                </p>
              )}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditComment(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    updateCommentMutation.isPending || !editComment.trim()
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {updateCommentMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          DELETE COMMENT CONFIRMATION
      ======================================================= */}
      {showDeleteCommentConfirm && post.topComment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
          onClick={() => setShowDeleteCommentConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Delete Comment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this comment? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteCommentConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteCommentMutation.mutate()}
                disabled={deleteCommentMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
              >
                {deleteCommentMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          EDIT POST MODAL
      ======================================================= */}
      {showEditPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
          onClick={() => setShowEditPost(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Post</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update your post content or image.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditPost(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!editPostBody.trim()) {
                  toast.error("Post content cannot be empty");
                  return;
                }

                updatePostMutation.mutate();
              }}
              className="p-6"
            >
              <textarea
                value={editPostBody}
                onChange={(e) => setEditPostBody(e.target.value)}
                rows={6}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="What's on your mind?"
              />

              {editPostPreview && (
                <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={editPostPreview}
                    alt="Post preview"
                    className="w-full max-h-72 object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setEditPostImage(null);
                      setEditPostPreview("");
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

              <label
                htmlFor={`edit-post-image-${post.id}`}
                className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition"
              >
                <ImageIcon size={18} />
                {editPostPreview ? "Change Image" : "Add Image"}

                <input
                  id={`edit-post-image-${post.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleEditPostImage}
                  className="hidden"
                />
              </label>

              {editPostImage && (
                <p className="mt-2 text-xs text-slate-400">
                  {editPostImage.name}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditPost(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatePostMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {updatePostMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          DELETE POST CONFIRMATION
      ======================================================= */}
      {showDeletePostConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
          onClick={() => setShowDeletePostConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">Delete Post?</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this post? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeletePostConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deletePostMutation.mutate()}
                disabled={deletePostMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition"
              >
                {deletePostMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}