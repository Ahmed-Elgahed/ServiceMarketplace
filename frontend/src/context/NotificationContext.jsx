import { createContext, useEffect, useState } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access");

    // ✅ لو مفيش توكن ماتفتحش سوكت
    if (!token) return;

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    socket.onopen = () => {
      console.log("Notification socket connected ✅");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data?.type === "new_notification") {
          setUnreadCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Notification socket closed");
    };

    return () => {
      socket.close();
    };
  }, []); // ✅ يفتح مرة واحدة بعد تحميل الصفحة

  const resetUnread = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ unreadCount, setUnreadCount, resetUnread }}
    >
      {children}
    </NotificationContext.Provider>
  );
}