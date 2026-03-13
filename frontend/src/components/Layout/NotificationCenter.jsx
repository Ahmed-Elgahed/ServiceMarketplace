/**
 * NEUX NOTIFICATION CENTER UI v1.0
 * -------------------------------
 * Description: Dropdown menu for real-time notifications with sound effects.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCircle, FiCheckCircle, FiDollarSign, FiMessageSquare } from 'react-icons/fi';
import axiosEngine from '../../api/AxiosEngine';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // 1. جلب الإشعارات من السيرفر
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axiosEngine.get('notifications/');
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.is_read).length);
            } catch (err) {
                console.error("Failed to sync notifications");
            }
        };
        fetchNotifications();
        
        // هنا يمكن إضافة Socket Listener لتحديث العد لحظياً
    }, []);

    const markAsRead = async (id) => {
        try {
            await axiosEngine.post(`notifications/${id}/read/`);
            setNotifications(prev => prev.map(n => n.id === id ? {...n, is_read: true} : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'payment_received': return <FiDollarSign className="text-green-500" />;
            case 'offer_received': return <FiMessageSquare className="text-blue-500" />;
            default: return <FiBell className="text-purple-500" />;
        }
    };

    return (
        <div className="relative">
            {/* الجرس الرئيسي */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
                <FiBell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* القائمة المنسدلة (Instagram Style) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h4 className="font-bold text-gray-900">Notifications</h4>
                            <button className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Mark all read</button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 text-sm">No notifications yet.</div>
                            ) : (
                                notifications.map((notif) => (
                                    <div 
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-purple-50/30' : ''}`}
                                    >
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-50">
                                            {getIcon(notif.notification_type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notif.is_read ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                                                {notif.verb}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">Just now</p>
                                        </div>
                                        {!notif.is_read && <FiCircle className="text-purple-500 fill-purple-500" size={8} />}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;