import {
  ArrowLeft,
  Bookmark,
  Clock3,
  Heart,
  MessageCircle,
  Share2,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function DetailsPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;

  // =========================================================
  // GET SINGLE POST
  // =========================================================
  const getSinglePost = async () => {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return data;
  };

  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
  } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: getSinglePost,
    enabled: !!postId,
  });

  // =========================================================
  // GET POST COMMENTS
  // =========================================================
  const getPostComments = async () => {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=${page * limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return data;
  };

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    isFetching: commentsFetching,
  } = useQuery({
    queryKey: ["postComments", postId, page],
    queryFn: getPostComments,
    enabled: !!postId,
  });

  // =========================================================
  // POST LOADING
  // =========================================================
  if (postLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-5 h-10 w-24 rounded-xl bg-slate-200 animate-pulse" />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm animate-pulse">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200" />

              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-48 rounded bg-slate-200" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
            </div>

            <div className="mt-6 h-80 rounded-2xl bg-slate-200" />
          </div>

          <div className="h-20 border-t border-slate-100 bg-slate-50" />
        </div>
      </div>
    );
  }

  // =========================================================
  // POST ERROR
  // =========================================================
  if (postError) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">
            Failed to load post
          </h2>

          <p className="mt-2 text-sm text-red-400">
            Something went wrong while loading this post.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // EXTRACT POST
  // =========================================================
  const post = postData?.data?.post || postData?.data;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Post Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            We couldn't find the post you're looking for.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg transition"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // FORMAT DATES
  // =========================================================
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formattedTime = post.createdAt
    ? new Date(post.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  // =========================================================
  // EXTRACT COMMENTS
  // =========================================================
  const comments =
    commentsData?.data?.comments ||
    commentsData?.data?.data?.comments ||
    commentsData?.comments ||
    [];

  const pagination =
    commentsData?.meta?.pagination ||
    commentsData?.data?.meta?.pagination ||
    commentsData?.data?.pagination ||
    null;

  const currentPage =
    pagination?.currentPage ||
    pagination?.current ||
    page;

  const totalPages =
    pagination?.totalPages ||
    pagination?.pages ||
    null;

  const hasMore =
    totalPages !== null
      ? currentPage < totalPages
      : comments.length >= page * limit;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* =====================================================
          BACK BUTTON
      ====================================================== */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-800 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* =====================================================
          POST CARD
      ====================================================== */}
      <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {/* Header */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            {/* User */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={post.user?.photo}
                alt={post.user?.name || "User"}
                className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50"
              />

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900 truncate">
                  {post.user?.name || "Unknown User"}
                </h2>

                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span className="truncate">
                    @{post.user?.username || "user"}
                  </span>

                  <span className="w-1 h-1 rounded-full bg-slate-300" />

                  <Clock3 size={13} />

                  <span>
                    {formattedDate} · {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy */}
            {post.privacy && (
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 capitalize">
                {post.privacy}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="mt-6">
            <p className="text-[16px] leading-8 text-slate-700 whitespace-pre-wrap break-words">
              {post.body}
            </p>
          </div>

          {/* Image */}
          {post.image && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img
                src={post.image}
                alt="Post"
                className="w-full max-h-[600px] object-contain bg-slate-50"
              />
            </div>
          )}
        </div>

        {/* ===================================================
            STATS
        ==================================================== */}
        <div className="px-5 sm:px-6 pb-4">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-5">
              <span>
                {post.likesCount ?? 0}{" "}
                {post.likesCount === 1 ? "Like" : "Likes"}
              </span>

              <span>
                {post.commentsCount ?? 0}{" "}
                {post.commentsCount === 1
                  ? "Comment"
                  : "Comments"}
              </span>
            </div>

            <span>
              {post.sharesCount ?? 0}{" "}
              {post.sharesCount === 1 ? "Share" : "Shares"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 sm:mx-6 border-t border-slate-100" />

        {/* ===================================================
            ACTIONS
        ==================================================== */}
        <div className="px-3 sm:px-4 py-3 grid grid-cols-4 gap-1">
          <button
            type="button"
            className="h-11 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition"
          >
            <Heart
              size={19}
              className={
                post.likesCount > 0
                  ? "fill-rose-500 text-rose-500"
                  : ""
              }
            />

            <span className="hidden sm:block text-sm font-semibold">
              Like
            </span>
          </button>

          <button
            type="button"
            className="h-11 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <MessageCircle size={19} />

            <span className="hidden sm:block text-sm font-semibold">
              Comment
            </span>
          </button>

          <button
            type="button"
            className="h-11 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition"
          >
            <Share2 size={19} />

            <span className="hidden sm:block text-sm font-semibold">
              Share
            </span>
          </button>

          <button
            type="button"
            className={`h-11 rounded-xl flex items-center justify-center gap-2 transition ${
              post.bookmarked
                ? "bg-amber-50 text-amber-500"
                : "text-slate-500 hover:bg-amber-50 hover:text-amber-500"
            }`}
          >
            <Bookmark
              size={19}
              className={post.bookmarked ? "fill-current" : ""}
            />

            <span className="hidden sm:block text-sm font-semibold">
              Save
            </span>
          </button>
        </div>
      </article>

      {/* =====================================================
          COMMENTS SECTION
      ====================================================== */}
      <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Comments
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {post.commentsCount ?? 0}{" "}
              {post.commentsCount === 1
                ? "comment"
                : "comments"}
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
        </div>

        {/* ===================================================
            COMMENTS LOADING
        ==================================================== */}
        {commentsLoading && (
          <div className="mt-5 space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-2/3 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================
            COMMENTS ERROR
        ==================================================== */}
        {!commentsLoading && commentsError && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-600">
              Failed to load comments
            </p>

            <p className="mt-1 text-xs text-red-400">
              Something went wrong while loading the comments.
            </p>
          </div>
        )}

        {/* ===================================================
            COMMENTS
        ==================================================== */}
        {!commentsLoading &&
          !commentsError &&
          comments.length > 0 && (
            <div className="mt-5 space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <img
                      src={comment.commentCreator?.photo}
                      alt={
                        comment.commentCreator?.name ||
                        "Comment creator"
                      }
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-2 ring-white"
                    />

                    {/* Comment Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className="text-sm font-bold text-slate-800">
                              {comment.commentCreator?.name ||
                                "User"}
                            </h3>

                            {comment.commentCreator?.username && (
                              <span className="text-xs text-slate-400">
                                @
                                {
                                  comment
                                    .commentCreator
                                    .username
                                }
                              </span>
                            )}
                          </div>

                          {comment.createdAt && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {new Date(
                                comment.createdAt
                              ).toLocaleString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <p className="mt-3 text-sm leading-6 text-slate-600 break-words whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {/* Image */}
                      {comment.image && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <img
                            src={comment.image}
                            alt="Comment"
                            className="w-full max-h-72 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* ===================================================
            EMPTY COMMENTS
        ==================================================== */}
        {!commentsLoading &&
          !commentsError &&
          comments.length === 0 && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-10 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                <MessageCircle size={22} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-700">
                No comments yet
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Be the first one to comment on this post.
              </p>
            </div>
          )}

        {/* ===================================================
            LOAD MORE
        ==================================================== */}
        {!commentsLoading &&
          !commentsError &&
          comments.length > 0 &&
          hasMore && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={commentsFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition disabled:opacity-60"
              >
                {commentsFetching ? (
                  <>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Comments
                    <ChevronDown size={17} />
                  </>
                )}
              </button>
            </div>
          )}
      </section>
    </div>
  );
}