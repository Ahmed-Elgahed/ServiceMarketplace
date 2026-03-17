/**
 * NEUX FEED PAGE v1.1 (Safe Version)
 */

import React, { useState, useEffect, useCallback } from "react";
import API from "../../services/api";
import PostCard from "../../components/Feed/PostCard";
import Navbar from "../../components/Layout/Navbar";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

const GlobalFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    const token = localStorage.getItem("access");

    // ✅ لو مفيش توكن مايضربش API
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await API.get("jobs/");

      setJobs(Array.isArray(res?.data) ? res.data : []);

    } catch (err) {
      console.error("Feed load error:", err);
      setError("Could not load feed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FiLoader
          className="animate-spin text-purple-600"
          size={40}
        />
        <p className="mt-4 text-gray-500 font-medium">
          Loading Neux Feed...
        </p>
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
                onBidClick={(selectedJob) =>
                  console.log("Bidding on:", selectedJob.id)
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GlobalFeed;