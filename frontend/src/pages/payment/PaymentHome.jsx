import { useEffect, useState, useRef } from "react";
import { getWallet } from "../../services/api";
import BottomNav from "../../components/Layout/BottomNav";

export default function PaymentHome() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    const loadWallet = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        const data = await getWallet();

        if (isMounted.current) {
          setBalance(Number(data?.balance || 0));
        }

      } catch (err) {
        console.error("Wallet fetch failed:", err);

        if (isMounted.current) {
          setError("Failed to load wallet.");
        }

      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    isMounted.current = true;
    loadWallet();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-16 px-4">

      <div className="max-w-md mx-auto">

        <h1 className="text-xl font-semibold mb-6">Wallet</h1>

        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
          <p className="text-gray-500 text-sm">Current Balance</p>

          {loading && (
            <p className="text-gray-400 mt-2">Loading...</p>
          )}

          {!loading && error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}

          {!loading && !error && (
            <h2 className="text-3xl font-bold mt-2">
              {balance.toLocaleString()} EGP
            </h2>
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}