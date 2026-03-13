import { useState } from "react";
import { sendMoney } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function SendMoney() {
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!recipient || !amount) {
      setError("Recipient and amount are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await sendMoney(recipient, amount, note);

      navigate("/payment-success", {
        state: {
          recipient,
          amount,
          note,
          transactionId: response.id,
        },
      });

    } catch (err) {
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 pt-20">

      <div className="max-w-md mx-auto space-y-4">

        <h2 className="text-xl font-bold dark:text-white">
          Send Money
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Recipient username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full border p-3 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-3 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border p-3 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>

      </div>
    </div>
  );
}