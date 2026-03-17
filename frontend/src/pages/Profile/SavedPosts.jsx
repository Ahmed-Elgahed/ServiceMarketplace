import BottomNav from "../../components/Layout/BottomNav";

export default function SavedPosts() {
  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-16">
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Saved</h2>

        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <img
              key={i}
              src={`https://picsum.photos/400?random=${i + 40}`}
              className="aspect-square object-cover"
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}