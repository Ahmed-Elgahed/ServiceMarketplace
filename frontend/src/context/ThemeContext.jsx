import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");

    if (saved !== null) {
      return saved === "true";
    }

    // ✅ لو مفيش اختيار سابق استخدم إعدادات الجهاز
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    // ✅ نحط الكلاس على html بدل div
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}