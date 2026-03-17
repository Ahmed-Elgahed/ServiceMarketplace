/**
 * NEUX POST CARD ENGINE v1.0
 * --------------------------
 * Description: Instagram-style card for Job listings.
 * Features: Framer Motion Animations, Skeleton Support, Dynamic Interactions.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FiHeart, FiMessageCircle, FiSend, FiBookmark, 
    FiMoreHorizontal, FiDollarSign, FiClock, FiCheckCircle 
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns'; // لتبسيط الوقت (منذ 5 دقائق)

const PostCard = ({ job, onBidClick }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // تحسين عرض العملة (Fintech Formatting)
    const formattedBudget = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(job.budget);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-[500px] mx-auto bg-white border border-gray-200 rounded-xl mb-8 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            {/* 1. HEADER (Client Info) */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img 
                            src={job.client_details.profile_picture || '/assets/default-avatar.png'} 
                            alt={job.client_details.username}
                            className="w-10 h-10 rounded-full object-cover border-[1.5px] border-purple-500 p-[2px]"
                        />
                        {job.client_details.is_verified && (
                            <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-[2px]">
                                <FiCheckCircle size={8} />
                            </span>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-none">
                            {job.client_details.username}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                            {job.category_name} • {formatDistanceToNow(new Date(job.created_at))} ago
                        </p>
                    </div>
                </div>
                <button className="text-gray-600 hover:text-black">
                    <FiMoreHorizontal size={20} />
                </button>
            </div>

            {/* 2. MEDIA SECTION (The Eye Candy) */}
            <div className="relative aspect-square bg-gray-100 group">
                {job.media ? (
                    <img 
                        src={job.media} 
                        alt={job.title}
                        className="w-full h-full object-cover"
                        onDoubleClick={() => setIsLiked(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                        <h2 className="text-white text-2xl font-black px-10 text-center uppercase tracking-tighter italic">
                            {job.title}
                        </h2>
                    </div>
                )}
                
                {/* Overlay Budget Tag */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20">
                    {formattedBudget}
                </div>
            </div>

            {/* 3. INTERACTION BAR */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsLiked(!isLiked)}
                            className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-700 hover:text-gray-400'}`}
                        >
                            <FiHeart size={24} />
                        </button>
                        <button className="text-gray-700 hover:text-gray-400">
                            <FiMessageCircle size={24} />
                        </button>
                        <button className="text-gray-700 hover:text-gray-400">
                            <FiSend size={24} />
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsSaved(!isSaved)}
                        className={`transition-colors ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700 hover:text-gray-400'}`}
                    >
                        <FiBookmark size={24} />
                    </button>
                </div>

                {/* 4. DESCRIPTION & BIDDING */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {job.offers_count} Bids
                        </span>
                        {job.lowest_bid && (
                            <span className="text-xs font-medium text-green-600">
                                Lowest: ${job.lowest_bid}
                            </span>
                        )}
                    </div>
                    
                    <p className="text-sm text-gray-800">
                        <span className="font-bold mr-2">{job.client_details.username}</span>
                        {job.description.length > 120 
                            ? `${job.description.substring(0, 120)}...` 
                            : job.description}
                    </p>
                    
                    {/* Professional Bid Button */}
                    <button 
                        onClick={() => onBidClick(job)}
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 rounded-lg shadow-lg shadow-purple-200 hover:scale-[1.02] transition-transform active:scale-95"
                    >
                        Send Offer Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;