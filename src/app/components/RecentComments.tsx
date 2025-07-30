"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Comment, User, Task } from "../lib/definitions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentComments() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchComments = () => {
    const url = taskId ? `/api/comments?taskId=${taskId}` : "/api/comments";
    fetch(url)
      .then((res) => res.json())
      .then((data: Comment[]) => {
        const sortedData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (taskId) {
          setComments(sortedData);
        } else {
          setComments(sortedData.slice(0, 5));
        }
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

    if (!taskId) {
      const interval = setInterval(() => {
        fetchComments();
        fetchTasks();
      }, 5000); // 每5秒刷新一次

      return () => clearInterval(interval);
    }
  }, [taskId]);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "未知用户";
  };

  const getTaskText = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    return task ? task.text : `任务 #${taskId}`;
  };

  const getTitle = () => {
    if (!taskId) {
      return "最新评论";
    }
    const task = tasks.find((t) => t.id === parseInt(taskId, 10));
    return task ? `任务 "${task.text}" 的评论` : `任务 #${taskId} 的评论`;
  };

  return (
    <div style={{ backgroundColor: 'var(--card-background)' }} className="rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ color: 'var(--foreground)' }} className="text-2xl font-semibold">{getTitle()}</h2>
        {taskId && (
          <Link href="/" className="text-sm text-indigo-500 hover:underline">
            &larr; 返回最新评论
          </Link>
        )}
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              layout
              key={comment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
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
