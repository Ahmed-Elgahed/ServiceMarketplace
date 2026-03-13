/**
 * NEUX FINTECH DASHBOARD v1.0
 * ---------------------------
 * Description: Advanced Wallet UI with Data Visualization.
 * Features: Income Analytics, Glassmorphism Balance Cards, Quick Actions.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell 
} from 'recharts';
import { 
    FiArrowUpRight, FiArrowDownLeft, FiClock, 
    FiPlus, FiExternalLink, FiShield 
} from 'react-icons/fi';
import axiosEngine from '../../api/AxiosEngine';
import { useAuth } from '../../context/AuthContext';

// بيانات تجريبية لمحاكاة محرك الإحصائيات (Analytics Engine)
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

    useEffect(() => {
        const fetchWalletInfo = async () => {
            try {
                const [walletRes, transRes] = await Promise.all([
                    axiosEngine.get('transactions/wallet/'),
                    axiosEngine.get('transactions/history/')
                ]);
                setWalletData(walletRes.data);
                setTransactions(transRes.data);
            } catch (err) {
                console.error("Fintech Engine Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWalletInfo();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* 1. HEADER & TOTAL BALANCE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    {/* Main Balance Card (Glassmorphism) */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-8 text-white shadow-2xl shadow-purple-200"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-indigo-100 text-sm font-medium opacity-80">Total Available Balance</p>
                                    <h1 className="text-5xl font-black mt-2 tracking-tighter">
                                        ${walletData.available.toLocaleString()}
                                    </h1>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                    <FiShield size={24} className="text-white" />
                                </div>
                            </div>

                            <div className="mt-12 flex space-x-8">
                                <div>
                                    <p className="text-xs text-indigo-100 opacity-70 uppercase tracking-widest">Frozen (Escrow)</p>
                                    <p className="text-xl font-bold mt-1">${walletData.frozen}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-100 opacity-70 uppercase tracking-widest">Currency</p>
                                    <p className="text-xl font-bold mt-1">USD</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative Circles */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl"></div>
                    </motion.div>

                    {/* Quick Actions Card */}
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
                        <p className="text-[10px] text-gray-400 mt-4 text-center">
                            Secured by NEUX Fintech Engine & Stripe Encryption.
                        </p>
                    </div>
                </div>

                {/* 2. ANALYTICS & CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Income Chart */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-gray-800 text-lg">Income Overview</h3>
                            <select className="bg-gray-50 border-none text-xs font-bold rounded-lg p-2 focus:ring-0">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={incomeStats}>
                                    <defs>
                                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#6366f1" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorAmt)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 text-lg mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            {transactions.slice(0, 4).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-2xl mr-4 ${tx.type === 'deposit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {tx.type === 'deposit' ? <FiPlus size={20} /> : <FiArrowDownLeft size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm uppercase">{tx.type}</p>
                                            <p className="text-xs text-gray-400">{tx.status} • {tx.created_at}</p>
                                        </div>
                                    </div>
                                    <p className={`font-black ${tx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                            View All Transactions
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WalletDashboard;