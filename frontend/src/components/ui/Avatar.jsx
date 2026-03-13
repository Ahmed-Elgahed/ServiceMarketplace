export default function Avatar({ src, size = "w-8 h-8", story = false }) {
  return (
    <div
      className={`rounded-full p-[2px] ${
        story ? "bg-gradient-to-tr from-yellow-400 to-fuchsia-600" : ""
      }`}
    >
      <img
        src={src}
        alt="avatar"
        className={`${size} rounded-full object-cover border-2 border-white`}
      />
    </div>
  );
}