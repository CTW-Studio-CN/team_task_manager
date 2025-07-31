"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

type ThemeContextType = {
  theme: string;
  toggleMode: () => void;
  setColor: (color: string) => void;
  cardOpacity: number;
  setCardOpacity: (opacity: number) => void;
  wallpaper: string;
  setWallpaper: (url: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light-blue"); // Default theme
  const [cardOpacity, setCardOpacityState] = useState(1);
  const [wallpaper, setWallpaperState] = useState("");

  const applyTheme = React.useCallback((newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  const colorMap: { [key: string]: string } = useMemo(() => ({
    blue: "#4f46e5", // indigo-600
    green: "#10b981", // emerald-500
    red: "#ef4444", // red-500
    purple: "#a855f7", // purple-500
    orange: "#f97316", // orange-500
    pink: "#ec4899", // pink-500
    teal: "#14b8a6", // teal-500
    cyan: "#06b6d4", // cyan-500
  }), []);

  const setColor = React.useCallback((newColor: string) => {
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
  }, [applyTheme, theme, colorMap]);

  const setCardOpacity = (opacity: number) => {
    setCardOpacityState(opacity);
    document.documentElement.style.setProperty("--card-opacity", opacity.toString());
    localStorage.setItem("cardOpacity", opacity.toString());
  };

  const setWallpaper = (url: string) => {
    setWallpaperState(url);
    document.documentElement.style.setProperty("--wallpaper-url", `url(${url})`);
    localStorage.setItem("wallpaper", url);
    if (url) {
      document.body.classList.add("wallpaper-active");
    } else {
      document.body.classList.remove("wallpaper-active");
    }
  };

  useEffect(() => {
    const savedOpacity = localStorage.getItem("cardOpacity");
    if (savedOpacity) {
      setCardOpacity(parseFloat(savedOpacity));
    }

    const savedWallpaper = localStorage.getItem("wallpaper");
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    } else {
      document.body.classList.remove("wallpaper-active");
    }
    const savedTheme = localStorage.getItem("theme");
    let initialTheme = "light-blue"; // Default theme

    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark-blue" : "light-blue";
    }
    
    const [, color] = initialTheme.split("-");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    // Ensure initial color is applied via setColor to handle custom hex codes
    setColor(color); 
  }, [setColor]);

  const toggleMode = () => {
    const [mode, color] = theme.split("-");
    const newMode = mode === "dark" ? "light" : "dark";
    applyTheme(`${newMode}-${color}`);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleMode, setColor, cardOpacity, setCardOpacity, wallpaper, setWallpaper }}>
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
