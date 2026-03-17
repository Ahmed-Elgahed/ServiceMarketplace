import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import FollowButton from "../../components/ui/FollowButton";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  // ✅ Load Profile Safely
  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token || !username) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const data = await getProfile(username);

      if (isMounted.current) {
        setProfile(data);
      }

    } catch (err) {
      console.error("Failed to load profile:", err);

      if (isMounted.current) {
        if (err.response?.status === 404) {
          setError("Profile not found.");
        } else {
          setError("Failed to load profile.");
        }
      }

    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [username]);

  useEffect(() => {
    isMounted.current = true;
    loadProfile();

    return () => {
      isMounted.current = false;
    };
  }, [loadProfile]);

  // ✅ Update Followers Safely
  const updateFollowers = (type) => {
    setProfile((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        followers_count:
          type === "follow"
            ? prev.followers_count + 1
            : Math.max(prev.followers_count - 1, 0),
      };
    });
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="pt-20 text-center dark:text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="pt-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="pt-20 pb-20 max-w-md mx-auto px-4 dark:text-white">

      {/* Header */}
      <div className="flex gap-6 items-center">

        <img
          src={profile.avatar || "/default-avatar.png"}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border dark:border-gray-700"
        />

        <div className="flex-1">

          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">{profile.username}</p>

            {!profile.is_me && (
              <FollowButton
                username={profile.username}
                isFollowingInitial={profile.is_following}
                onFollow={updateFollowers}
              />
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-3 text-center">

            <div>
              <p className="font-bold">{profile.posts_count || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posts
              </p>
            </div>

            <div
              className="cursor-pointer"
              onClick={() =>
                navigate(`/${profile.username}/followers`)
              }
            >
              <p className="font-bold">
                {profile.followers_count || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </p>
            </div>

            <div
              className="cursor-pointer"
              onClick={() =>
                navigate(`/${profile.username}/following`)
              }
            >
              <p className="font-bold">
                {profile.following_count || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Following
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mt-4 text-sm">
          <p className="font-semibold">
            {profile.full_name}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Logout */}
      {profile.is_me && (
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
}