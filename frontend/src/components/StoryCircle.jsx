export default function StoryCircle({ img, name }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
        <img src={img} className="w-full h-full rounded-full border-2 border-white" />
      </div>
      <p className="text-[11px] truncate w-16 text-center">{name}</p>
    </div>
  );
}