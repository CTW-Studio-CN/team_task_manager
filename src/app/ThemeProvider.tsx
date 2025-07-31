"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { ThemeSettings } from "./lib/definitions";

type ThemeContextType = {
  themeSettings: ThemeSettings;
  setThemeSettings: (settings: ThemeSettings) => void;
  toggleMode: () => void;
  setColor: (color: string) => void;
  cardOpacity: number;
  setCardOpacity: (opacity: number) => void;
  wallpaper?: string;
  setWallpaper: (url: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeSettings, setThemeSettingsState] = useState<ThemeSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      const savedOpacity = localStorage.getItem("cardOpacity");
      const savedWallpaper = localStorage.getItem("wallpaper");

      let initialTheme = "light-blue";
      if (savedTheme) {
        initialTheme = savedTheme;
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        initialTheme = prefersDark ? "dark-blue" : "light-blue";
      }

      return {
        darkMode: initialTheme.startsWith("dark"),
        primaryColor: initialTheme.split("-")[1],
        transparency: savedOpacity ? parseFloat(savedOpacity) : 1,
        wallpaper: savedWallpaper || "",
      };
    }
    return {
      darkMode: false,
      primaryColor: "blue",
      transparency: 1,
      wallpaper: "",
    };
  });

  const applyTheme = React.useCallback((newTheme: string) => {
    setThemeSettingsState(prev => ({
      ...prev,
      darkMode: newTheme.startsWith("dark"),
      primaryColor: newTheme.split("-")[1],
    }));
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
    const newTheme = `${themeSettings.darkMode ? "dark" : "light"}-${newColor}`;
    applyTheme(newTheme);

    const primaryColorValue = colorMap[newColor] || newColor;

    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--primary-color", primaryColorValue);
      document.documentElement.style.setProperty("--primary-hover-color", primaryColorValue + "d0");
      document.documentElement.style.setProperty("--ring-color", primaryColorValue);
    });
  }, [applyTheme, themeSettings.darkMode, colorMap]);

  const setCardOpacity = (opacity: number) => {
    setThemeSettingsState(prev => ({
      ...prev,
      transparency: opacity,
    }));
    document.documentElement.style.setProperty("--card-opacity", opacity.toString());
    localStorage.setItem("cardOpacity", opacity.toString());
  };

  const setWallpaper = (url: string) => {
    setThemeSettingsState(prev => ({
      ...prev,
      wallpaper: url,
    }));
    document.documentElement.style.setProperty("--wallpaper-url", `url(${url})`);
    localStorage.setItem("wallpaper", url);
    if (url) {
      document.body.classList.add("wallpaper-active");
    } else {
      document.body.classList.remove("wallpaper-active");
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", `${themeSettings.darkMode ? "dark" : "light"}-${themeSettings.primaryColor}`);
    document.documentElement.style.setProperty("--card-opacity", themeSettings.transparency.toString());
    document.documentElement.style.setProperty("--wallpaper-url", `url(${themeSettings.wallpaper})`);

    if (themeSettings.wallpaper) {
      document.body.classList.add("wallpaper-active");
    } else {
      document.body.classList.remove("wallpaper-active");
    }

    const primaryColorValue = colorMap[themeSettings.primaryColor] || themeSettings.primaryColor;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--primary-color", primaryColorValue);
      document.documentElement.style.setProperty("--primary-hover-color", primaryColorValue + "d0");
      document.documentElement.style.setProperty("--ring-color", primaryColorValue);
    });
  }, [themeSettings, colorMap]);

  const toggleMode = () => {
    const newMode = themeSettings.darkMode ? "light" : "dark";
    applyTheme(`${newMode}-${themeSettings.primaryColor}`);
  };

  return (
    <ThemeContext.Provider value={{
      themeSettings,
      setThemeSettings: setThemeSettingsState,
      toggleMode,
      setColor,
      cardOpacity: themeSettings.transparency,
      setCardOpacity,
      wallpaper: themeSettings.wallpaper,
      setWallpaper,
    }}>
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
