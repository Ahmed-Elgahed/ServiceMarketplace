// src/Jobs.js
import React, { useEffect, useState } from "react";
import API, { setToken } from "./api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // لو عندك Access Token
    const token = "هنا حط الـ Access Token بتاعك";
    setToken(token);

    API.get("jobs/") // هتبعت GET request للـ backend
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Jobs List</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;