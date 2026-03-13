import { useState } from "react";
import { followUser } from "../../services/api";

export default function FollowButton({ username }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await followUser(username);
      setFollowing(!following);
    } catch (err) {
      console.error("Follow failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition
      ${following ? "bg-gray-200 text-black" : "bg-blue-500 text-white"}`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}