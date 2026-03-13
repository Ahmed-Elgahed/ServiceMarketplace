import React from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiGrid, FiList, FiStar } from 'react-icons/fi';

const ProfileMaster = ({ userData }) => {
    return (
        <div className="max-w-4xl mx-auto pt-24 px-4">
            {/* Header: Avatar & Stats */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-16 mb-12">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1">
                    <img src={userData.profile_picture} className="w-full h-full rounded-full border-4 border-white object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                        <h2 className="text-2xl font-light">{userData.username}</h2>
                        <button className="bg-gray-100 px-4 py-1 rounded-md text-sm font-bold">Edit Profile</button>
                        <FiSettings size={20} className="cursor-pointer" />
                    </div>
                    <div className="flex justify-center md:justify-start space-x-8 mb-4">
                        <span><strong>{userData.total_jobs}</strong> jobs</span>
                        <span><strong>{userData.rating}</strong> rating</span>
                    </div>
                    <p className="font-bold">{userData.first_name} {userData.last_name}</p>
                    <p className="text-sm text-gray-600">{userData.bio}</p>
                </div>
            </div>

            {/* Grid View of Previous Work */}
            <div className="border-t border-gray-200">
                <div className="flex justify-center space-x-12 -mt-[1px]">
                    <div className="border-t border-black py-4 flex items-center space-x-2 cursor-pointer uppercase text-xs font-bold tracking-widest">
                        <FiGrid size={14} /> <span>Posts</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1 md:gap-8">
                    {userData.portfolio.map(item => (
                        <div key={item.id} className="aspect-square bg-gray-100 overflow-hidden group relative">
                            <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <FiStar className="mr-2" /> {item.rating}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};