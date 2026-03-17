import React, { createContext, useState, useEffect, useContext } from "react";
import API, { setToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setToken(token);

        // ✅ بدل users/me نخلي المستخدم موجود بمجرد وجود توكن
        setUser({ authenticated: true });

      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post("users/login/", {
        username,
        password,
      });

      const { access, refresh } = res.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setToken(access);

      // ✅ ما نستدعيش users/me
      setUser({ username });

      return { success: true };

    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);