import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

export default function PostCard({ post }) {
  return (
    <div className="bg-white border rounded-md mb-6">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={post.avatar} className="w-10 h-10 rounded-full" />
          <p className="font-bold">{post.username}</p>
        </div>
        <MoreHorizontal />
      </div>

      <img src={post.image} className="w-full object-cover" />

      <div className="px-4 py-3">
        <div className="flex justify-between text-2xl mb-2">
          <div className="flex gap-4">
            <Heart />
            <MessageCircle />
            <Send />
          </div>
          <Bookmark />
        </div>

        <p className="font-bold">{post.likes} likes</p>
        <p><span className="font-bold">{post.username}</span> {post.caption}</p>
      </div>
    </div>
  );
}