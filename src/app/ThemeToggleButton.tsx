"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";
import ColorPickerModal from "./ColorPickerModal";
import { AnimatePresence } from "framer-motion";

const ThemeToggleButton = () => {
  const { theme, toggleMode, setColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const isDarkMode = theme.startsWith("dark");

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
        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
      >
        <span className={`text-xl transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'rotate-0' : 'rotate-180'}`}>
          {isDarkMode ? "🌙" : "☀️"}
        </span>
      </button>
      <button
        onClick={handleOpenColorPicker}
        className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-offset-2 transition-all duration-300 ease-in-out"
        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
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
