import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import TopNav from "../../components/Layout/TopNav";
import BottomNav from "../../components/Layout/BottomNav";
import { NotificationContext } from "../../context/NotificationContext";

export default function Messages() {
  const navigate = useNavigate();
  const { resetUnread } = useContext(NotificationContext);

  // ✅ تصفير عداد الرسائل غير المقروءة عند دخول الصفحة
  useEffect(() => {
    resetUnread();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-14 pb-16 transition-colors">

      <TopNav />

      <div className="max-w-md mx-auto p-4 space-y-4">

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            onClick={() => navigate(`/messages/chat/${i}`)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-3 rounded-lg transition-all"
          >

            {/* Avatar */}
            <img
              src={`https://i.pravatar.cc/150?u=${i}`}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            {/* Text */}
            <div className="flex-1">
              <p className="font-semibold text-sm dark:text-white">
                user_{i}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Last message preview...
              </p>
            </div>

          </div>
        ))}

      </div>

      <BottomNav />
    </div>
  );
}