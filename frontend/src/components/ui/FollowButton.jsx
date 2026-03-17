import { useState, useEffect } from "react";
import { followUser } from "../../services/api";

export default function FollowButton({
  username,
  isFollowingInitial = false,
  onFollow,
}) {
  const [following, setFollowing] = useState(isFollowingInitial);
  const [loading, setLoading] = useState(false);

  // ✅ تحديث الحالة لو القيمة اتغيرت من البروفايل
  useEffect(() => {
    setFollowing(isFollowingInitial);
  }, [isFollowingInitial]);

  const handleFollow = async () => {
    const token = localStorage.getItem("access");

    // ✅ حماية
    if (!token || !username || loading) return;

    try {
      setLoading(true);

      await followUser(username);

      const newState = !following;
      setFollowing(newState);

      // ✅ تحديث البروفايل لو فيه callback
      if (onFollow) {
        onFollow(newState ? "follow" : "unfollow");
      }

    } catch (err) {
      console.error("Follow failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200
        ${
          following
            ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }
        ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}
      `}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}