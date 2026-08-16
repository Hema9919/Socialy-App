import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import PostCard from "../../components/PostCard/PostCard";
import CreatePost from "../../components/CreatePost/CreatePost";

export default function Home() {
  const getPosts = async () => {
    const { data } = await axios.get(
      "https://route-posts.routemisr.com/posts",
      {
        params: {
          limit: 100,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return data.data.posts;
  };

  const {
    data: allposts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error, Try Later");
    }
  }, [isError]);

  return (
    <>
      <CreatePost />

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />

                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/6" />
                </div>
              </div>

              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />

              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && allposts?.length > 0 && (
        <div>
          {allposts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!isLoading && allposts?.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No Posts
          </p>
        </div>
      )}
    </>
  );
}