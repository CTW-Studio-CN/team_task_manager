"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ColorPickerModalProps {
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

const predefinedColors = [
  "blue", "green", "red", "purple", "orange", "pink", "teal", "cyan"
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ onClose, onColorSelect }) => {
  const [customColor, setCustomColor] = useState("");

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const handleSelectCustomColor = () => {
    if (customColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      onColorSelect(customColor);
      onClose();
    } else {
      alert("请输入有效的十六进制颜色码 (例如: #RRGGBB 或 #RGB)");
    }
  };

  const handleSelectPredefinedColor = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose} // 点击背景关闭
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80"
          onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
        >
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">选择主题颜色</h2>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {predefinedColors.map((color) => (
              <button
                key={color}
                className="w-full h-10 rounded-md border-2 border-transparent hover:border-gray-400"
                style={{ backgroundColor: color }}
                onClick={() => handleSelectPredefinedColor(color)}
              ></button>
            ))}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="#RRGGBB"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              value={customColor}
              onChange={handleCustomColorChange}
            />
            <button
              onClick={handleSelectCustomColor}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            >
              应用自定义颜色
            </button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md"
            >
              取消
            </button>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default ColorPickerModal;
