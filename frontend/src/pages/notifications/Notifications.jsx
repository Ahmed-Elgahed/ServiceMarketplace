import { useEffect, useState, useCallback, useRef } from "react";
import { getNotifications } from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await getNotifications();

      if (isMounted.current) {
        setNotifications(Array.isArray(data) ? data : []);
      }

    } catch (err) {
      console.error("Failed to load notifications:", err);

      if (isMounted.current) {
        setError("Failed to load notifications.");
      }

    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadNotifications();

    return () => {
      isMounted.current = false;
    };
  }, [loadNotifications]);

  return (
    <div className="pt-14 pb-16 bg-gray-50 min-h-screen p-4">

      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-center text-gray-500">
          No notifications yet
        </p>
      )}

      {!loading && !error &&
        notifications.map((n) => (
          <div
            key={n.id} // ✅ بدل index
            className="bg-white p-3 mb-3 rounded-lg border"
          >
            {n.message}
          </div>
        ))}

    </div>
  );
}