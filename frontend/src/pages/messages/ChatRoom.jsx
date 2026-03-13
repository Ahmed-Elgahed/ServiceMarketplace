import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import {
  connectSocket,
  sendSocketMessage,
  disconnectSocket,
} from "../../services/socket";

export default function ChatRoom({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);

  // ============================
  // ✅ تحميل الرسائل القديمة (REST)
  // ============================
  const loadMessages = async () => {
    try {
      const res = await API.get(`messages/${conversationId}/`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages");
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // ============================
  // ✅ WebSocket Connection
  // ============================
  useEffect(() => {
    connectSocket(conversationId, (data) => {

      // ✅ Presence Update
      if (data.type === "presence_update") {
        setIsOnline(data.is_online);
        setLastSeen(data.last_seen);
      }

      // ✅ رسالة جديدة
      if (data.type === "message") {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === data.id);
          if (exists) return prev;
          return [...prev, data];
        });
      }

      // ✅ Typing Indicator
      if (data.type === "typing") {
        setIsTyping(true);

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    return () => {
      disconnectSocket();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId]);

  // ============================
  // ✅ Scroll لتحت تلقائي
  // ============================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ============================
  // ✅ إرسال رسالة
  // ============================
  const handleSend = () => {
    if (!text.trim()) return;

    sendSocketMessage({
      type: "message",
      text,
    });

    setText("");
  };

  // ============================
  // ✅ إرسال typing event
  // ============================
  const handleTyping = (e) => {
    setText(e.target.value);

    sendSocketMessage({
      type: "typing",
    });
  };

  return (
    <div className="flex flex-col h-screen pt-14 bg-white dark:bg-black">

      {/* ✅ Chat Header */}
      <div className="p-3 border-b dark:border-gray-800 flex items-center gap-2 bg-white dark:bg-black">

        {/* Green Dot */}
        <div
          className={`w-3 h-3 rounded-full transition-all ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />

        <div className="text-sm dark:text-white">
          {isOnline
            ? "Online"
            : lastSeen
            ? `Last seen ${lastSeen}`
            : "Offline"}
        </div>
      </div>

      {/* ✅ Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-black">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-3 py-2 rounded-lg text-sm transition-all
              ${
                msg.is_me
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 dark:text-white"
              }
            `}
          >
            {msg.text}
          </div>
        ))}

        {/* ✅ Typing Indicator */}
        {isTyping && (
          <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            User is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ✅ Input */}
      <div className="p-3 border-t dark:border-gray-800 flex gap-2 bg-white dark:bg-black">
        <input
          value={text}
          onChange={handleTyping}
          className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type message..."
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}