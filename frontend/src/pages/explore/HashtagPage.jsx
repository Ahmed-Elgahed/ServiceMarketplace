import { useParams } from "react-router-dom";

export default function HashtagPage() {
  const { tag } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-lg font-semibold mb-4">#{tag}</h2>

      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <img
            key={i}
            src={`https://picsum.photos/400?random=${i}`}
            className="aspect-square object-cover"
          />
        ))}
      </div>
    </div>
  );
}