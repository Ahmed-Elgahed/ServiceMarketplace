/**
 * NEUX SEARCH MASTER UI v1.0
 * --------------------------
 * Description: Interactive search bar with dynamic filters and debounced input.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiSliders, FiChevronDown } from 'react-icons/fi';
import axiosEngine from '../../api/AxiosEngine';
import _ from 'lodash'; // مكتبة مساعدة للـ Debouncing

const SearchMaster = ({ onResultsFound }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        min_budget: '',
        max_budget: '',
        sort: '-created_at'
    });

    // 1. وظيفة البحث (Debounced)
    // المبدأ: Parallel Computing Efficiency (تقليل عدد الطلبات للسيرفر)
    const performSearch = useCallback(
        _.debounce(async (query, currentFilters) => {
            try {
                const params = { q: query, ...currentFilters };
                const res = await axiosEngine.get('jobs/search/', { params });
                onResultsFound(res.data);
            } catch (err) {
                console.error("Search Engine Failure", err);
            }
        }, 500), // انتظر 500ms بعد آخر ضغطة زرار
        []
    );

    useEffect(() => {
        performSearch(searchTerm, filters);
    }, [searchTerm, filters, performSearch]);

    return (
        <div className="max-w-[600px] mx-auto mb-10 px-4">
            <div className="relative group">
                {/* Search Input */}
                <div className="relative flex items-center">
                    <FiSearch className="absolute left-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for services (e.g. Plumbing, Logo Design...)"
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-14 shadow-xl shadow-purple-50 focus:border-purple-500 focus:ring-0 transition-all outline-none text-sm font-medium"
                    />
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-4 p-2 rounded-xl transition-all ${showFilters ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        <FiSliders size={18} />
                    </button>
                </div>

                {/* Filters Dropdown (Instagram/Modern Style) */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-6 z-40"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
                                    <select 
                                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-xl text-xs font-bold p-3"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="programming">Programming</option>
                                        <option value="design">Design</option>
                                        <option value="repairs">Home Repairs</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sort By</label>
                                    <select 
                                        onChange={(e) => setFilters({...filters, sort: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-xl text-xs font-bold p-3"
                                    >
                                        <option value="-created_at">Newest First</option>
                                        <option value="budget">Lowest Price</option>
                                        <option value="-budget">Highest Price</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Min Budget ($)</label>
                                    <input 
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => setFilters({...filters, min_budget: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-xl text-xs font-bold p-3"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Max Budget ($)</label>
                                    <input 
                                        type="number"
                                        placeholder="5000"
                                        onChange={(e) => setFilters({...filters, max_budget: e.target.value})}
                                        className="w-full bg-gray-50 border-none rounded-xl text-xs font-bold p-3"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                                <button 
                                    onClick={() => {
                                        setFilters({ category: '', min_budget: '', max_budget: '', sort: '-created_at' });
                                        setSearchTerm("");
                                    }}
                                    className="text-xs font-bold text-red-500 uppercase tracking-widest"
                                >
                                    Clear All
                                </button>
                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Programming', 'Design', 'Marketing', 'Plumbing', 'Electrical'].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="whitespace-nowrap bg-white border border-gray-100 px-4 py-1.5 rounded-full text-[11px] font-bold text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchMaster;