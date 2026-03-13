import { createContext, useEffect, useState } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access");

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_notification") {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.onclose = () => {
      console.log("Notification socket closed");
    };

    return () => socket.close();
  }, []);

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