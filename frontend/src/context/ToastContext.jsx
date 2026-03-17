import { createContext, useState } from "react";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}