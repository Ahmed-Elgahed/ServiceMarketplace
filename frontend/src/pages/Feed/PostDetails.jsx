import { useParams } from "react-router-dom";
import CommentSection from "../../components/post/CommentSection";

export default function PostDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white p-4">
      <img
        src={`https://picsum.photos/600?random=${id}`}
        className="w-full aspect-square object-cover rounded-lg"
      />

      <div className="mt-4">
        <p className="font-semibold">username</p>
        <p className="text-sm mt-1">Full caption here...</p>
      </div>

      <CommentSection />
    </div>
  );
}