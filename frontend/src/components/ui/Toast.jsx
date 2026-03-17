import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // ✅ لو مفيش رسالة ماتظهرش
  if (!message) return null;

  return (
    <div className="
      fixed bottom-20 left-1/2 -translate-x-1/2
      bg-black text-white px-6 py-3 rounded-full
      shadow-lg z-50
      animate-fadeIn
    ">
      {message}
    </div>
  );
}