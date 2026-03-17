import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // ✅ مؤقتًا بنضيف الرسالة للـ state بس
    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">

      <h2 className="text-lg font-semibold mb-4">
        Chat ID: {id}
      </h2>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="bg-blue-500 text-white px-4 py-2 rounded-full w-fit"
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="flex mt-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}