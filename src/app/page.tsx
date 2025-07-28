"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  status: "todo" | "in-progress" | "completed";
  assignedTo: string[];
  tags: string[];
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "completed">("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      });
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    let filtered = tasks;
    if (filter !== "all") {
      filtered = tasks.filter((task) => task.status === filter);
    }
    // 将已完成的任务排在最后
    filtered.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  const updateTasks = async (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks),
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === "" || !session) return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      status: "todo",
      assignedTo: [],
      tags: [],
    };
    updateTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTaskCompletion = (id: number) => {
    if (!session) return;
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            status: !task.completed ? "completed" : ("todo" as "completed" | "todo"),
          }
        : task
    );
    updateTasks(updatedTasks);
  };

  const handleDeleteTask = (id: number) => {
    if (!session) return;
    const updatedTasks = tasks.filter((task) => task.id !== id);
    updateTasks(updatedTasks);
  };

  const handleUpdateTask = (id: number, newText: string, newAssignedTo: string[], newTags: string[]) => {
    if (!session) return;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText, assignedTo: newAssignedTo, tags: newTags } : task
    );
    updateTasks(updatedTasks);
    setEditingTask(null);
  };
  
  const getAssigneeNames = (userIds: string[]) => {
    if (!userIds || userIds.length === 0) return "未分配";
    return userIds.map(id => {
      const user = users.find((u) => u.id === id);
      return user ? user.name : "未知用户";
    }).join(', ');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <header className="shadow-md" style={{ backgroundColor: 'var(--card-background)' }}>
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              任务管理器
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                <span style={{ color: 'var(--foreground)' }}>欢迎, {session.user?.name}</span>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" style={{ color: 'var(--foreground)', transition: 'color 0.2s' }} className="hover:text-indigo-500">
                    管理
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="font-semibold px-4 py-2 rounded-lg transition duration-200"
                  style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                >
                  注销
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: 'var(--foreground)', transition: 'color 0.2s' }} className="hover:text-indigo-500">
                  登录
                </Link>
                <Link href="/signup" className="font-semibold px-4 py-2 rounded-lg transition duration-200" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                  注册
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>团队任务管理器</h1>
        </header>

        <div className="max-w-4xl mx-auto rounded-xl shadow-lg p-8" style={{ backgroundColor: 'var(--card-background)' }}>
          {session && (
            <form onSubmit={handleAddTask} className="flex items-center gap-4 mb-8">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="添加新任务..."
                className="flex-grow px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] transition duration-200"
                style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)' }}
              />
              <button
                type="submit"
                className="font-semibold px-6 py-3 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-opacity-75 transition duration-200 shadow-md"
                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
              >
                添加
              </button>
            </form>
          )}

          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg ${filter === 'all' ? '' : ''}`} style={{ backgroundColor: filter === 'all' ? 'var(--primary-color)' : 'var(--secondary-button-bg)', color: filter === 'all' ? 'white' : 'var(--secondary-button-text)' }}>所有</button>
            <button onClick={() => setFilter("todo")} className={`px-4 py-2 rounded-lg ${filter === 'todo' ? '' : ''}`} style={{ backgroundColor: filter === 'todo' ? 'var(--primary-color)' : 'var(--secondary-button-bg)', color: filter === 'todo' ? 'white' : 'var(--secondary-button-text)' }}>待办</button>
            <button onClick={() => setFilter("in-progress")} className={`px-4 py-2 rounded-lg ${filter === 'in-progress' ? '' : ''}`} style={{ backgroundColor: filter === 'in-progress' ? 'var(--primary-color)' : 'var(--secondary-button-bg)', color: filter === 'in-progress' ? 'white' : 'var(--secondary-button-text)' }}>进行中</button>
            <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded-lg ${filter === 'completed' ? '' : ''}`} style={{ backgroundColor: filter === 'completed' ? 'var(--primary-color)' : 'var(--secondary-button-bg)', color: filter === 'completed' ? 'white' : 'var(--secondary-button-text)' }}>已完成</button>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>任务列表</h2>
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 mb-3 rounded-lg shadow-sm"
                  style={{ backgroundColor: 'var(--input-background)' }}
                >
                  {editingTask?.id === task.id && session ? (
                    <div className="flex-grow flex flex-col gap-4">
                        <input
                          type="text"
                          defaultValue={task.text}
                          onBlur={(e) => handleUpdateTask(task.id, e.target.value, task.assignedTo, task.tags)}
                          className="flex-grow px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)]"
                          style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)' }}
                        />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">分配给:</h3>
                        <div className="flex flex-wrap gap-2">
                          {users.map(user => (
                            <label key={user.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={task.assignedTo.includes(user.id)}
                                onChange={(e) => {
                                  const newAssignedTo = e.target.checked
                                    ? [...task.assignedTo, user.id]
                                    : task.assignedTo.filter(id => id !== user.id);
                                  handleUpdateTask(task.id, task.text, newAssignedTo, task.tags);
                                }}
                              />
                              {user.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">标签:</h3>
                        <input
                          type="text"
                          defaultValue={task.tags.join(', ')}
                          onBlur={(e) => handleUpdateTask(task.id, task.text, task.assignedTo, e.target.value.split(',').map(t => t.trim()))}
                          className="flex-grow px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)]"
                          style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)' }}
                        />
                      </div>
                      <button onClick={() => setEditingTask(null)} className="font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--text-muted)', color: 'white' }}>完成编辑</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={!!task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          disabled={!session}
                          className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ring-[var(--ring-color)]"
                          style={{ borderColor: 'var(--border-color)', color: 'var(--primary-color)' }}
                        />
                        <span
                          className={`cursor-pointer flex-grow text-lg ${
                            task.completed
                              ? "line-through"
                              : ""
                          }`}
                          style={{ color: task.completed ? 'var(--text-completed)' : 'var(--foreground)' }}
                        >
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded" style={{ backgroundColor: 'var(--blue-tag-bg)', color: 'var(--blue-tag-text)' }}>{tag}</span>
                          ))}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{getAssigneeNames(task.assignedTo)}</span>
                        {session && (
                          <>
                            <button
                              onClick={() => setEditingTask(task)}
                              className="font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm"
                              style={{ backgroundColor: 'var(--yellow-color)', color: 'white' }}
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-opacity-75 transition duration-200 shadow-sm"
                              style={{ backgroundColor: 'var(--red-color)', color: 'white' }}
                            >
                              删除
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
