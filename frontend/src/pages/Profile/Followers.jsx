export default function Followers() {
  return (
    <div className="min-h-screen bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Followers</h2>

      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 mb-4">
          <img
            src={`https://i.pravatar.cc/150?u=${i}`}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold text-sm">user_{i}</span>
        </div>
      ))}
    </div>
  );
}