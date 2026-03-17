// src/Jobs.js
import React, { useEffect, useState, useCallback } from "react";
import API from "./services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    const token = localStorage.getItem("access");

    // ✅ لو مفيش توكن ماتضربش API
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get("jobs/");
      setJobs(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Jobs List</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="p-3 bg-gray-100 rounded">
              {job.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;