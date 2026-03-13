import { useState } from "react";
import { Heart } from "lucide-react";
import { likePost } from "../../services/api";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked(!liked); // optimistic
    try {
        await likePost(postId);
    } catch (err) {
        setLiked(!liked); // rollback
    }
  };

  return (
    <Heart
      onClick={handleLike}
      size={24}
      className={`cursor-pointer ${
        liked ? "text-red-500 fill-red-500" : "text-black"
      }`}
    />
  );
}