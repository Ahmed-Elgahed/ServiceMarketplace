/**
 * NEUX REAL-TIME CHAT INTERFACE v1.0
 * ----------------------------------
 * Description: High-performance Chat UI with WebSocket integration.
 * Features: Instant Messaging, Typing Indicators, Framer Motion Bubbles.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiImage, FiPaperclip, FiMoreVertical, FiCheck, FiCheckCircle } from 'react-icons/fi';
import axiosEngine from '../../api/AxiosEngine';
import { useAuth } from '../../context/AuthContext';

const ChatSystem = ({ conversationId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const scrollRef = useRef(null);

    // 1. إعداد اتصال الـ WebSocket (Real-time Hub)
    useEffect(() => {
        const wsUrl = `ws://127.0.0.1:8000/ws/chat/${conversationId}/`;
        const chatSocket = new WebSocket(wsUrl);

        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prev) => [...prev, data]);
        };

        chatSocket.onclose = (e) => console.error("Chat socket closed unexpectedly");
        setSocket(chatSocket);

        return () => chatSocket.close();
    }, [conversationId]);

    // 2. جلب تاريخ الرسائل القديمة
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosEngine.get(`chat/conversations/${conversationId}/messages/`);
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to load history");
            }
        };
        fetchHistory();
    }, [conversationId]);

    // 3. التمرير التلقائي لآخر رسالة
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            message: newMessage,
            type: 'text',
            sender_id: user.id,
            timestamp: new Date().toISOString()
        };

        socket.send(json.stringify(messageData));
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-2xl">
            
            {/* CHAT HEADER */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500" />
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">John Doe (Worker)</h4>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <FiMoreVertical size={20} />
                </button>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                <AnimatePresence>
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${
                                    isMe 
                                    ? 'bg-gray-900 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                    <p>{msg.message || msg.content}</p>
                                    <div className={`flex items-center mt-1 space-x-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <span className="text-[9px] opacity-50 uppercase font-bold">
                                            {new Date(msg.timestamp || msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        {isMe && <FiCheck className="text-blue-400" size={12} />}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            {/* MESSAGE INPUT */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
                <button type="button" className="text-gray-400 hover:text-purple-600 transition-colors">
                    <FiImage size={22} />
                </button>
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button 
                    disabled={!newMessage.trim()}
                    type="submit" 
                    className={`p-3 rounded-full transition-all ${
                        newMessage.trim() 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                >
                    <FiSend size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatSystem;