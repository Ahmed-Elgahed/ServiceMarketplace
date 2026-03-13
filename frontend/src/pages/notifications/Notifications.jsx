import { useEffect, useState } from "react";
import { getNotifications } from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getNotifications();
      setNotifications(data);
    }
    load();
  }, []);

  return (
    <div className="pt-14 pb-16 bg-gray-50 min-h-screen p-4">
      {notifications.map((n, i) => (
        <div key={i} className="bg-white p-3 mb-3 rounded-lg border">
          {n.message}
        </div>
      ))}
    </div>
  );
}