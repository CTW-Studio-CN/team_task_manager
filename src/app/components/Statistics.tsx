"use client";

import { motion } from "framer-motion";

interface StatisticsProps {
  progress: number;
}

export default function Statistics({ progress }: StatisticsProps) {
  return (
    <div style={{ backgroundColor: 'var(--card-background)' }} className="rounded-xl shadow-lg p-6">
      <h2 style={{ color: 'var(--foreground)' }} className="text-2xl font-semibold mb-4">任务进度</h2>
      <div className="mt-6">
        <h3 style={{ color: 'var(--foreground)' }} className="text-lg font-semibold mb-2">任务完成进度</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <motion.div
            className="bg-blue-600 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="text-right text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {progress.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
