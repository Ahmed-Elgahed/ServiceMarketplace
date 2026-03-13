import Avatar from "../ui/Avatar";

export default function Stories() {
  const users = Array.from({ length: 10 });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex gap-4 overflow-x-auto scrollbar-hide">
      
      {/* Your story */}
      <div className="flex flex-col items-center">
        <Avatar src="https://i.pravatar.cc/150?u=me" size="w-16 h-16" />
        <span className="text-xs mt-1 text-gray-500">Your story</span>
      </div>

      {users.map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <Avatar
            src={`https://i.pravatar.cc/150?u=${i}`}
            size="w-16 h-16"
            story={true}
          />
          <span className="text-xs mt-1 truncate w-16 text-center">
            user_{i}
          </span>
        </div>
      ))}
    </div>
  );
}