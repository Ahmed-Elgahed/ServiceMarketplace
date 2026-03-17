export default function SkeletonPost() {
  return (
    <div className="bg-white border rounded-lg mb-6 animate-pulse">
      <div className="flex items-center p-3 gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="w-24 h-4 bg-gray-300 rounded" />
      </div>
      <div className="w-full aspect-square bg-gray-300" />
      <div className="p-3 space-y-2">
        <div className="w-16 h-4 bg-gray-300 rounded" />
        <div className="w-40 h-4 bg-gray-300 rounded" />
      </div>
    </div>
  );
}