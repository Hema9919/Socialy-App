import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PostCard from "./../../components/PostCard/PostCard";
import CreatePost from "../../components/CreatePost/CreatePost";

export default function Home() {
  const [allposts, setallposts] = useState(null);
  const [loding, setloding] = useState(true);
  function getPosts() {
    axios
      .get("https://route-posts.routemisr.com/posts", {
        params: { limit: 100 },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((resp) => {
        console.log(resp.data.data.posts);
        setallposts(resp.data.data.posts);
      })
      .catch((error) => {
        console.log(error.response);
        toast.error("Error, Try Later");
      })
      .finally(() => {
        setloding(false);
      });
  }
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <CreatePost />
      {loding && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      )}
      {allposts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}{" "}
    </>
  );
}
