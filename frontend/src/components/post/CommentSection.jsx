import { useState } from "react";
import { addComment } from "../../services/api";

export default function CommentSection({ postId }) {
  const [input, setInput] = useState("");

  const handleComment = async () => {
    if (!input.trim()) return;

    try {
      await addComment(postId, input);
      setInput("");
    } catch {
      console.error("Comment failed");
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border rounded-full px-4 py-2 text-sm"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleComment}
        className="bg-blue-500 text-white px-4 rounded-full"
      >
        Post
      </button>
    </div>
  );
}