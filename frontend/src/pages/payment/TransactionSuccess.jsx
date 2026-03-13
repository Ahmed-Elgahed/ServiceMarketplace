import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function TransactionSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const { recipient, amount, note, transactionId } = state;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 text-center">

      {/* ✅ Success Animation */}
      <CheckCircle
        size={80}
        className="text-green-500 animate-bounce mb-6"
      />

      <h2 className="text-2xl font-bold dark:text-white">
        Payment Sent Successfully
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Your transaction has been completed.
      </p>

      {/* ✅ Receipt Card */}
      <div className="mt-8 w-full max-w-sm bg-gray-100 dark:bg-gray-900 rounded-xl p-6 space-y-3 text-left">

        <div className="flex justify-between">
          <span className="text-gray-500">To:</span>
          <span className="font-semibold dark:text-white">
            {recipient}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Amount:</span>
          <span className="font-semibold text-green-500">
            ${amount}
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
        onClick={() => navigate("/")}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
      >
        Back to Home
      </button>

    </div>
  );
}