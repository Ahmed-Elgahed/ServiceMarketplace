import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

export default function TransactionSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const hasCelebrated = useRef(false);

  // ✅ Redirect safely
  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // ✅ Circle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // ✅ Confetti once
  useEffect(() => {
    if (progress === 100 && !hasCelebrated.current) {
      hasCelebrated.current = true;

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      const audio = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
      );

      audio.play().catch(() => {});
    }
  }, [progress]);

  // ✅ بعد ما كل الـ hooks اتنادت نقدر نعمل check
  if (!state) return null;

  const { recipient, amount, note, transactionId } = state;

  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 text-center">

      <div className="relative mb-6">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#22c55e"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 0.3s",
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {progress === 100 && (
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            ✅
          </span>
        )}
      </div>

      <h2 className="text-2xl font-bold dark:text-white">
        Payment Successful
      </h2>

      <div className="mt-8 w-full max-w-sm bg-gray-100 dark:bg-gray-900 rounded-xl p-6 space-y-3 text-left shadow-lg">

        <div className="flex justify-between">
          <span className="text-gray-500">To:</span>
          <span className="font-semibold dark:text-white">
            {recipient}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Amount:</span>
          <span className="font-semibold text-green-500">
            ${Number(amount).toLocaleString()}
          </span>
        </div>

        {note && (
          <div className="flex justify-between">
            <span className="text-gray-500">Note:</span>
            <span className="dark:text-white">{note}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-400 mt-4">
          <span>Transaction ID:</span>
          <span>{transactionId}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/", { replace: true })}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all"
      >
        Back to Home
      </button>
    </div>
  );
}