/**
 * NEUX FEED PAGE v1.0
 * ------------------
 * Description: The main discovery page with infinite scroll.
 */

import React, { useState, useEffect } from 'react';
import axiosEngine from '../../api/AxiosEngine';
import PostCard from '../../components/Feed/PostCard';
import Navbar from '../../components/Layout/Navbar';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

const GlobalFeed = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // جلب البيانات من محرك الـ API الموزع
    const fetchFeed = async () => {
        try {
            setLoading(true);
            const res = await axiosEngine.get('jobs/');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            setError("Could not load feed. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    if (loading && jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <FiLoader className="animate-spin text-purple-600" size={40} />
                <p className="mt-4 text-gray-500 font-medium">Loading Neux Feed...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            
            <main className="pt-20 pb-10 px-4">
                {error && (
                    <div className="max-w-[500px] mx-auto bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-6">
                        <FiAlertCircle className="mr-3" />
                        {error}
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-medium">
                        No services available in your area yet.
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {jobs.map((job) => (
                            <PostCard 
                                key={job.id} 
                                job={job} 
                                onBidClick={(selectedJob) => console.log("Bidding on:", selectedJob.id)} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GlobalFeed;