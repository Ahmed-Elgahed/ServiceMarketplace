import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
    FiArrowUpRight, FiArrowDownLeft, 
    FiPlus, FiExternalLink, FiShield 
} from 'react-icons/fi';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const incomeStats = [
    { day: 'Mon', amount: 45 },
    { day: 'Tue', amount: 120 },
    { day: 'Wed', amount: 89 },
    { day: 'Thu', amount: 200 },
    { day: 'Fri', amount: 150 },
    { day: 'Sat', amount: 300 },
    { day: 'Sun', amount: 250 },
];

const WalletDashboard = () => {
    const { user } = useAuth();
    const [walletData, setWalletData] = useState({ available: 0, frozen: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWalletInfo = useCallback(async () => {
        const token = localStorage.getItem("access");

        // ✅ لو مفيش توكن ماتضربش API
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const [walletRes, transRes] = await Promise.all([
                API.get('payments/wallet/'),
                API.get('payments/history/')
            ]);

            setWalletData(walletRes?.data || { available: 0, frozen: 0 });
            setTransactions(Array.isArray(transRes?.data) ? transRes.data : []);

        } catch (err) {
            console.error("Fintech Engine Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletInfo();
    }, [fetchWalletInfo]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading Wallet...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-8 text-white shadow-2xl shadow-purple-200"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-indigo-100 text-sm font-medium opacity-80">
                                        Total Available Balance
                                    </p>
                                    <h1 className="text-5xl font-black mt-2 tracking-tighter">
                                        ${Number(walletData.available).toLocaleString()}
                                    </h1>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                    <FiShield size={24} className="text-white" />
                                </div>
                            </div>

                            <div className="mt-12 flex space-x-8">
                                <div>
                                    <p className="text-xs text-indigo-100 opacity-70 uppercase tracking-widest">
                                        Frozen (Escrow)
                                    </p>
                                    <p className="text-xl font-bold mt-1">
                                        ${Number(walletData.frozen)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-100 opacity-70 uppercase tracking-widest">
                                        Currency
                                    </p>
                                    <p className="text-xl font-bold mt-1">USD</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between bg-gray-900 text-white p-4 rounded-2xl hover:bg-black transition-all group">
                                <span className="flex items-center">
                                    <FiPlus className="mr-3" /> Deposit Funds
                                </span>
                                <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <button className="w-full flex items-center justify-between border-2 border-gray-100 p-4 rounded-2xl hover:bg-gray-50 transition-all">
                                <span className="flex items-center text-gray-700 font-semibold">
                                    <FiArrowDownLeft className="mr-3" /> Withdraw
                                </span>
                                <FiExternalLink className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-lg mb-8">
                            Income Overview
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={incomeStats}>
                                    <XAxis dataKey="day" />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#6366f1" 
                                        fill="#6366f1" 
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-lg mb-6">
                            Recent Activity
                        </h3>

                        <div className="space-y-6">
                            {transactions.slice(0, 4).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-2xl mr-4 bg-gray-100">
                                            {tx.type === 'deposit' 
                                                ? <FiPlus size={20} /> 
                                                : <FiArrowDownLeft size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm uppercase">
                                                {tx.type}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {tx.status} • {tx.created_at}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-black">
                                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletDashboard;