"use client";

import { useEffect, useState } from "react";
import { Task, User } from "../lib/definitions";

export default function Statistics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const totalUsers = users.length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "medium"
  ).length;
  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === "low"
  ).length;

  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div style={{ backgroundColor: 'var(--card-background)' }} className="rounded-xl shadow-lg p-6">
      <h2 style={{ color: 'var(--foreground)' }} className="text-2xl font-semibold mb-4">统计</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div style={{ color: 'var(--foreground)' }} className="text-4xl font-bold">{totalTasks}</div>
          <div style={{ color: 'var(--text-muted)' }}>总任务数</div>
        </div>
        <div className="text-center">
          <div style={{ color: 'var(--foreground)' }} className="text-4xl font-bold">{completedTasks}</div>
          <div style={{ color: 'var(--text-muted)' }}>已完成</div>
        </div>
        <div className="text-center">
          <div style={{ color: 'var(--foreground)' }} className="text-4xl font-bold">{pendingTasks}</div>
          <div style={{ color: 'var(--text-muted)' }}>待处理</div>
        </div>
        <div className="text-center">
          <div style={{ color: 'var(--foreground)' }} className="text-4xl font-bold">{totalUsers}</div>
          <div style={{ color: 'var(--text-muted)' }}>总用户数</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 style={{ color: 'var(--foreground)' }} className="text-lg font-semibold mb-2">任务完成进度</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-right text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {completedTasks} / {totalTasks}
        </div>
      </div>

      <div className="mt-6">
        <h3 style={{ color: 'var(--foreground)' }} className="text-lg font-semibold mb-2">任务优先级分布</h3>
        <div className="flex justify-around text-center">
          <div>
            <div className="text-red-500 text-2xl font-bold">{highPriorityTasks}</div>
            <div style={{ color: 'var(--text-muted)' }}>高</div>
          </div>
          <div>
            <div className="text-yellow-500 text-2xl font-bold">{mediumPriorityTasks}</div>
            <div style={{ color: 'var(--text-muted)' }}>中</div>
          </div>
          <div>
            <div className="text-green-500 text-2xl font-bold">{lowPriorityTasks}</div>
            <div style={{ color: 'var(--text-muted)' }}>低</div>
          </div>
        </div>
      </div>
    </div>
  );
}
