"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  toggleMode: () => void;
  setColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light-blue"); // Default theme

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    let initialTheme = "light-blue"; // Default theme

    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark-blue" : "light-blue";
    }
    
    const [mode, color] = initialTheme.split("-");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    // Ensure initial color is applied via setColor to handle custom hex codes
    setColor(color); 
  }, []);

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMode = () => {
    const [mode, color] = theme.split("-");
    const newMode = mode === "dark" ? "light" : "dark";
    applyTheme(`${newMode}-${color}`);
  };

  const colorMap: { [key: string]: string } = {
    blue: "#4f46e5", // indigo-600
    green: "#10b981", // emerald-500
    red: "#ef4444", // red-500
    purple: "#a855f7", // purple-500
    orange: "#f97316", // orange-500
    pink: "#ec4899", // pink-500
    teal: "#14b8a6", // teal-500
    cyan: "#06b6d4", // cyan-500
  };

  const setColor = (newColor: string) => {
    const [mode] = theme.split("-");
    const fullThemeName = `${mode}-${newColor}`;
    applyTheme(fullThemeName);

    let primaryColorValue = newColor;
    if (colorMap[newColor]) {
      primaryColorValue = colorMap[newColor];
    }

    // 使用 requestAnimationFrame 确保平滑过渡
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--primary-color", primaryColorValue);
      document.documentElement.style.setProperty("--primary-hover-color", primaryColorValue + "d0");
      document.documentElement.style.setProperty("--ring-color", primaryColorValue);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
