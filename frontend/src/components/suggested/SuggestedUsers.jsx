import FollowButton from "../ui/FollowButton";

export default function SuggestedUsers() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-sm mb-4">Suggested for you</h3>

      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={`https://i.pravatar.cc/150?u=${i + 30}`}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-semibold">suggested_{i}</span>
          </div>
          <FollowButton />
        </div>
      ))}
    </div>
  );
}