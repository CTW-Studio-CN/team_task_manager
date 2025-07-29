"use client";

import { useEffect, useState } from "react";
import { Comment, User, Task } from "../lib/definitions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchComments = () => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data: Comment[]) => {
        const sortedData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setComments(sortedData.slice(0, 5));
      });
  };

  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  const fetchTasks = () => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchComments();
    fetchUsers();
    fetchTasks();

    const interval = setInterval(() => {
      fetchComments();
      fetchTasks();
    }, 5000); // 每5秒刷新一次

    return () => clearInterval(interval);
  }, []);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "未知用户";
  };

  const getTaskText = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    return task ? task.text : "未知任务";
  };

  return (
    <div style={{ backgroundColor: 'var(--card-background)' }} className="rounded-xl shadow-lg p-6">
      <h2 style={{ color: 'var(--foreground)' }} className="text-2xl font-semibold mb-4">最新评论</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--input-background)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{getUserName(comment.userId)}</span>
                <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <p className="truncate">
                在 <Link href={`/?taskId=${comment.taskId}`} className="text-indigo-500 hover:underline">{getTaskText(comment.taskId)}</Link> 中: {comment.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        {comments.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>暂无评论。</p>
        )}
      </div>
    </div>
  );
}
