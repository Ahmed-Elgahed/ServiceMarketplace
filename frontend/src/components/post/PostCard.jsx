import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { likePost } from "../../services/api";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post?.is_liked || false);
  const [likesCount, setLikesCount] = useState(
    post?.likes_count || 0
  );
  const [saved, setSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  if (!post || deleted) return null;

  // ✅ Optimistic Like
  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount((prev) =>
      newLikedState ? prev + 1 : prev - 1
    );

    try {
      await likePost(post.id);
    } catch (err) {
      // rollback لو فشل
      setLiked(!newLikedState);
      setLikesCount((prev) =>
        newLikedState ? prev - 1 : prev + 1
      );
    }
  };

  // ✅ Double Tap Like Animation
  const handleDoubleClick = () => {
    setShowHeart(true);
    if (!liked) handleLike();

    setTimeout(() => {
      setShowHeart(false);
    }, 800);
  };

  // ✅ Caption Formatter (Hashtag & Mention)
  const renderCaption = (text) => {
    if (!text) return null;

    return text.split(" ").map((word, i) => {
      if (word.startsWith("#")) {
        return (
          <span
            key={i}
            onClick={() =>
              navigate(`/tag/${word.substring(1)}`)
            }
            className="text-blue-500 cursor-pointer"
          >
            {word}{" "}
          </span>
        );
      }

      if (word.startsWith("@")) {
        return (
          <span
            key={i}
            onClick={() =>
              navigate(`/profile/${word.substring(1)}`)
            }
            className="text-blue-500 cursor-pointer"
          >
            {word}{" "}
          </span>
        );
      }

      return <span key={i}>{word} </span>;
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm relative">
      
      {/* ✅ Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() =>
            navigate(`/profile/${post.user?.username}`)
          }
        >
          <img
            src={
              post.user?.avatar ||
              "https://i.pravatar.cc/150?u=default"
            }
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />
          <p className="font-semibold text-sm">
            {post.user?.username}
          </p>
        </div>

        <MoreHorizontal
          size={20}
          className="cursor-pointer"
          onClick={() => setShowOptions(true)}
        />
      </div>

      {/* ✅ Image */}
      <div
        className="relative"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={post.image}
          className="w-full aspect-square object-cover cursor-pointer"
          onClick={() =>
            navigate(`/post/${post.id}`)
          }
          alt="post"
        />

        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart
              size={90}
              className="text-white fill-white drop-shadow-lg"
            />
          </div>
        )}
      </div>

      {/* ✅ Actions */}
      <div className="px-4 py-3">
        <div className="flex justify-between text-xl mb-2">
          <div className="flex gap-4">
            <Heart
              onClick={handleLike}
              className={`cursor-pointer ${
                liked
                  ? "text-red-500 fill-red-500"
                  : "text-black"
              }`}
            />

            <MessageCircle
              className="cursor-pointer"
              onClick={() =>
                navigate(`/post/${post.id}`)
              }
            />

            <Send className="cursor-pointer" />
          </div>

          <Bookmark
            onClick={() => setSaved(!saved)}
            className={`cursor-pointer ${
              saved
                ? "fill-black text-black"
                : "text-black"
            }`}
          />
        </div>

        <p className="font-semibold text-sm mb-1">
          {likesCount} likes
        </p>

        <p className="text-sm">
          <span
            className="font-semibold mr-1 cursor-pointer"
            onClick={() =>
              navigate(`/profile/${post.user?.username}`)
            }
          >
            {post.user?.username}
          </span>
          {renderCaption(post.caption)}
        </p>

        <p
          className="text-gray-500 text-sm mt-1 cursor-pointer"
          onClick={() =>
            navigate(`/post/${post.id}`)
          }
        >
          View comments
        </p>
      </div>

      {/* ✅ More Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-lg p-4 text-center">
            <button
              onClick={() => {
                setDeleted(true);
                setShowOptions(false);
              }}
              className="text-red-500 font-semibold block w-full py-2 border-b"
            >
              Delete
            </button>

            <button className="block w-full py-2 border-b">
              Report
            </button>

            <button
              onClick={() =>
                setShowOptions(false)
              }
              className="block w-full py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}