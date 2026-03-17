import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMoreVertical, FiCheck } from "react-icons/fi";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ChatSystem = ({ conversationId }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // ✅ WebSocket Setup
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token || !conversationId) return;

    const protocol =
      window.location.protocol === "https:" ? "wss" : "ws";

    const wsUrl = `${protocol}://${window.location.host}/ws/chat/${conversationId}/?token=${token}`;

    const chatSocket = new WebSocket(wsUrl);

    chatSocket.onopen = () => {
      console.log("Chat connected ✅");
    };

    chatSocket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };

    chatSocket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    chatSocket.onclose = () => {
      console.log("Chat socket closed");
    };

    socketRef.current = chatSocket;

    return () => {
      chatSocket.close();
    };
  }, [conversationId]);

  // ✅ Load message history
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token || !conversationId) return;

    const fetchHistory = async () => {
      try {
        const res = await API.get(
          `chat/conversations/${conversationId}/messages/`
        );

        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();
  }, [conversationId]);

  // ✅ Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN ||
      !user
    )
      return;

    const messageData = {
      message: newMessage,
      type: "text",
      sender_id: user.id,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.send(JSON.stringify(messageData));
    setNewMessage("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-2xl">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <h4 className="font-bold text-sm">Chat</h4>
        <FiMoreVertical size={18} />
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === user?.id;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                    isMe
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  <p>{msg.message || msg.content}</p>

                  <div className="flex items-center mt-1 space-x-1 text-[9px] opacity-50">
                    <span>
                      {new Date(
                        msg.timestamp || msg.created_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && <FiCheck size={10} />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t flex items-center space-x-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-purple-500"
        />

        <button
          disabled={!newMessage.trim()}
          type="submit"
          className={`p-3 rounded-full ${
            newMessage.trim()
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatSystem;