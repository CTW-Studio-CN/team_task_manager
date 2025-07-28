"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

const ThemeToggleButton = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-offset-2"
        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
      <button
        onClick={() => setTheme("light")}
        className="p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-offset-2"
        style={{ backgroundColor: 'var(--secondary-button-bg)', color: 'var(--secondary-button-text)' }}
      >
        蓝色主题
      </button>
      <button
        onClick={() => setTheme("green")}
        className="p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-offset-2"
        style={{ backgroundColor: 'var(--secondary-button-bg)', color: 'var(--secondary-button-text)' }}
      >
        绿色主题
      </button>
    </div>
  );
};

export default ThemeToggleButton;
