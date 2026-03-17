import { useState } from "react";
import API from "../../services/api";

export default function AdminPanel() {

  const [userId, setUserId] = useState("");
  const [postId, setPostId] = useState("");

  const handleBan = async () => {
    await API.post(`admin/ban/${userId}/`);
    alert("User banned ✅");
  };

  const handleSuspend = async () => {
    await API.post(`admin/suspend/${userId}/`);
    alert("User suspended ✅");
  };

  const handleDeletePost = async () => {
    await API.delete(`admin/delete-post/${postId}/`);
    alert("Post deleted ✅");
  };

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-black">

      <h1 className="text-2xl font-bold dark:text-white mb-6">
        Super Admin Panel
      </h1>

      <div className="space-y-6 max-w-md">

        <div>
          <input
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-3 w-full rounded-lg"
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={handleBan}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Ban
            </button>

            <button
              onClick={handleSuspend}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Suspend
            </button>
          </div>
        </div>

        <div>
          <input
            placeholder="Post ID"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            className="border p-3 w-full rounded-lg"
          />

          <button
            onClick={handleDeletePost}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-3"
          >
            Delete Post
          </button>
        </div>

      </div>
    </div>
  );
}