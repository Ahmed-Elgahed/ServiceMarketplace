import TopNav from "../../components/Layout/TopNav";
import BottomNav from "../../components/Layout/BottomNav";

export default function Explore() {
  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-16">
      <TopNav />

      <div className="max-w-md mx-auto p-2">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 18 }).map((_, i) => (
            <img
              key={i}
              src={`https://picsum.photos/400?random=${i}`}
              alt={`Explore item ${i + 1}`}  // ✅ تم إضافة alt
              className="aspect-square object-cover"
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}