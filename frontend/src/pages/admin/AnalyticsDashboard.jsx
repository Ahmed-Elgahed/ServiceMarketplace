import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AnalyticsDashboard() {
  const { loading: authLoading } = useAuth(); // ✅ تم حذف user

  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await API.get("admin/analytics/");

      setRevenueData(
        Array.isArray(res?.data?.revenue) ? res.data.revenue : []
      );

      setUserGrowthData(
        Array.isArray(res?.data?.user_growth)
          ? res.data.user_growth
          : []
      );

      setMetrics(res?.data?.metrics || {});

    } catch (err) {
      console.error("Failed to load analytics:", err);

      if (err.response?.status === 403) {
        setError("unauthorized");
      } else {
        setError("failed");
      }

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      loadAnalytics();
    }
  }, [authLoading, loadAnalytics]);

  // ✅ لسه بيتحقق من الجلسة
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white">
        Loading analytics...
      </div>
    );
  }

  // ✅ لو مش Admin
  if (error === "unauthorized") {
    return <Navigate to="/" replace />;
  }

  // ✅ فشل تحميل
  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load analytics
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">

      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Admin Analytics Dashboard
      </h1>

      {/* ✅ Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-500">
            ${Number(metrics.total_revenue || 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold dark:text-white">
            {metrics.total_users || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-500">Active Today</p>
          <p className="text-2xl font-bold text-blue-500">
            {metrics.active_today || 0}
          </p>
        </div>

      </div>

      {/* ✅ Revenue Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-10">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Revenue (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ User Growth Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          User Growth
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}