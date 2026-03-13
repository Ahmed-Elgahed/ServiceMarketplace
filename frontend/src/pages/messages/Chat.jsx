import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(["Hello 👋"]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, message]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <h2 className="font-bold mb-4">Chat with user_{id}</h2>

      <div className="flex-1 space-y-2">
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
          placeholder="Type message..."
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