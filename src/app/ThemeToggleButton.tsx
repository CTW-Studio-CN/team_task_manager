"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import ColorPickerModal from "./ColorPickerModal";
import { AnimatePresence } from "framer-motion";

const ThemeToggleButton = () => {
  const { themeSettings, toggleMode, setColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isDarkMode = themeSettings.darkMode;
  const [rotationClass, setRotationClass] = useState('');

  useEffect(() => {
    setRotationClass(isDarkMode ? 'rotate-0' : 'rotate-180');
    setMounted(true);
  }, [isDarkMode]);

  const handleOpenColorPicker = () => {
    setShowColorPicker(true);
  };

  const handleCloseColorPicker = () => {
    setShowColorPicker(false);
  };

  const handleColorSelect = (color: string) => {
    setColor(color);
    handleCloseColorPicker();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={toggleMode}
        className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-offset-2 transition-all duration-300 ease-in-out"
        style={{ backgroundColor: `var(--primary-color)`, color: 'white' }}
      >
        <span className={`text-xl transform transition-transform duration-300 ease-in-out ${rotationClass}`}>
          {mounted ? (isDarkMode ? "🌙" : "☀️") : null}
        </span>
      </button>
      <button
        onClick={handleOpenColorPicker}
        className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-offset-2 transition-all duration-300 ease-in-out"
        style={{ backgroundColor: `var(--primary-color)`, color: 'white' }}
      >
        <span className="text-xl">🎨</span>
      </button>

      <AnimatePresence>
        {showColorPicker && (
          <ColorPickerModal
            onClose={handleCloseColorPicker}
            onColorSelect={handleColorSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggleButton;
