import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { NotificationContext } from "../../context/NotificationContext";

export default function TopNav() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { unreadCount } = useContext(NotificationContext);

  return (
    <div className="fixed top-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 h-14 flex items-center justify-between px-4 z-50">

      <Link to="/">
        <h1 className="text-xl font-serif italic tracking-tight text-black dark:text-white">
          Proly Connect
        </h1>
      </Link>

      <div className="flex items-center gap-5 text-black dark:text-white relative">

        <Heart size={24} className="cursor-pointer" />

        {/* ✅ Messages Icon + Badge */}
        <Link to="/messages" className="relative">
          <MessageCircle size={24} className="cursor-pointer" />

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-lg"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

      </div>
    </div>
  );
}