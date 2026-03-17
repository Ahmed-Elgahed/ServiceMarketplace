/**
 * NEUX SEARCH MASTER UI v1.1 (Safe Version)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSliders } from 'react-icons/fi';
import API from '../../services/api';
import _ from 'lodash';

const SearchMaster = ({ onResultsFound }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        min_budget: '',
        max_budget: '',
        sort: '-created_at'
    });

    // ✅ Debounced search (آمن + قابل للإلغاء)
    const debouncedSearch = useMemo(() => {
        return _.debounce(async (query, currentFilters) => {
            const token = localStorage.getItem("access");
            if (!token) return;

            try {
                const params = { q: query, ...currentFilters };
                const res = await API.get('jobs/search/', { params });

                if (onResultsFound && Array.isArray(res?.data)) {
                    onResultsFound(res.data);
                }

            } catch (err) {
                console.error("Search Engine Failure:", err);
            }
        }, 500);
    }, [onResultsFound]);

    // ✅ تنفيذ البحث عند تغيير القيم
    useEffect(() => {
        debouncedSearch(searchTerm, filters);

        return () => {
            debouncedSearch.cancel(); // ✅ يمنع memory leak
        };
    }, [searchTerm, filters, debouncedSearch]);

    return (
        <div className="max-w-[600px] mx-auto mb-10 px-4">
            <div className="relative group">

                {/* Search Input */}
                <div className="relative flex items-center">
                    <FiSearch className="absolute left-5 text-gray-400" size={20} />

                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for services..."
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-14 shadow-xl focus:border-purple-500 outline-none text-sm font-medium"
                    />

                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-4 p-2 rounded-xl transition-all ${
                            showFilters
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                        <FiSliders size={18} />
                    </button>
                </div>

                {/* Filters Dropdown */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-6 z-40"
                        >
                            <div className="grid grid-cols-2 gap-4">

                                <select 
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                    className="bg-gray-50 rounded-xl text-xs font-bold p-3"
                                >
                                    <option value="">All Categories</option>
                                    <option value="programming">Programming</option>
                                    <option value="design">Design</option>
                                    <option value="repairs">Home Repairs</option>
                                </select>

                                <select 
                                    onChange={(e) => setFilters({...filters, sort: e.target.value})}
                                    className="bg-gray-50 rounded-xl text-xs font-bold p-3"
                                >
                                    <option value="-created_at">Newest First</option>
                                    <option value="budget">Lowest Price</option>
                                    <option value="-budget">Highest Price</option>
                                </select>

                                <input 
                                    type="number"
                                    placeholder="Min Budget"
                                    onChange={(e) => setFilters({...filters, min_budget: e.target.value})}
                                    className="bg-gray-50 rounded-xl text-xs font-bold p-3"
                                />

                                <input 
                                    type="number"
                                    placeholder="Max Budget"
                                    onChange={(e) => setFilters({...filters, max_budget: e.target.value})}
                                    className="bg-gray-50 rounded-xl text-xs font-bold p-3"
                                />
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button 
                                    onClick={() => {
                                        setFilters({
                                            category: '',
                                            min_budget: '',
                                            max_budget: '',
                                            sort: '-created_at'
                                        });
                                        setSearchTerm("");
                                    }}
                                    className="text-xs font-bold text-red-500"
                                >
                                    Clear All
                                </button>

                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-full text-xs font-bold"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchMaster;