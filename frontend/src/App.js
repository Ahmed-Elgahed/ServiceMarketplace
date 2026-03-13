// src/App.js
import React, { useEffect, useState } from "react";
import API, { setToken } from "./api";
import Login from "./Login";
import './App.css';
import NeuxLogo from "./components/Logo"; // اللوجو اللي عملناه

function App() {
  const [jobs, setJobs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  // ضبط الـ Access Token من localStorage عند بداية التطبيق
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setToken(token);
    }
  }, []);

  // جلب البيانات من الـ API
  const fetchJobs = async () => {
    try {
      const res = await API.get("jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchJobs();
    }
  }, [loggedIn]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setLoggedIn(false);
    setJobs([]);
  };

  // لو مش مسجل دخول، عرض شاشة Login
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <NeuxLogo size={80} animated={true} />
        <h1>Jobs List</h1>
        <button onClick={handleLogout}>Logout</button>
        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>
                <strong>{job.title}</strong> - {job.status} - ${job.budget}
              </li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;