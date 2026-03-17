import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);