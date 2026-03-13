import { useEffect, useState } from "react";
import { getPosts } from "../../services/api";
import PostCard from "../../components/post/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ تحميل البوستات
  const loadPosts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const data = await getPosts(page);

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data.results]);
      }

    } catch (err) {
      console.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحميل أول مرة + عند تغيير الصفحة
  useEffect(() => {
    loadPosts();
  }, [page]);

  return (
    <div className="pt-14 pb-16 max-w-md mx-auto px-4">

      {posts.length === 0 && !loading && (
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
          No posts yet
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* ✅ Load More Button */}
      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg transition-all
            ${
              loading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center mt-6 text-gray-400 text-sm">
          You're all caught up 🎉
        </p>
      )}

    </div>
  );
}