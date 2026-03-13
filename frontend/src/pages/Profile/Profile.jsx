import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "../../services/api";
import FollowButton from "../../components/ui/FollowButton";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ تحميل البيانات
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getProfile(username);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  // ✅ تحديث عدد المتابعين لحظيًا
  const updateFollowers = (type) => {
    setProfile((prev) => ({
      ...prev,
      followers_count:
        type === "follow"
          ? prev.followers_count + 1
          : Math.max(prev.followers_count - 1, 0),
    }));
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="pt-20 text-center dark:text-white">
        <p>Loading profile...</p>
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
                onFollow={updateFollowers}
              />
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-3 text-center">

            <div>
              <p className="font-bold">{profile.posts_count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posts
              </p>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => navigate(`/${profile.username}/followers`)}
            >
              <p className="font-bold">{profile.followers_count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </p>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => navigate(`/${profile.username}/following`)}
            >
              <p className="font-bold">{profile.following_count}</p>
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

      {/* Logout (لو حسابك) */}
      {profile.is_me && (
        <button
          onClick={logoutUser}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      )}

    </div>
  );
}