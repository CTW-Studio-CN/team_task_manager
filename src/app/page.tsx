"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  status: "todo" | "in-progress" | "completed";
  assignedTo: string | null;
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
    if (newTaskText.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      status: "todo",
      assignedTo: null,
    };
    updateTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTaskCompletion = (id: number) => {
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
    const updatedTasks = tasks.filter((task) => task.id !== id);
    updateTasks(updatedTasks);
  };

  const handleUpdateTask = (id: number, newText: string, newAssignedTo: string | null) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText, assignedTo: newAssignedTo } : task
    );
    updateTasks(updatedTasks);
    setEditingTask(null);
  };
  
  const getAssigneeName = (userId: string | null) => {
    if (!userId) return "未分配";
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "未知用户";
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-800 dark:text-white">
            任务管理器
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-gray-800 dark:text-white">欢迎, {session.user?.name}</span>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-800 dark:text-white hover:text-indigo-500">
                    管理
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  注销
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-800 dark:text-white hover:text-indigo-500">
                  登录
                </Link>
                <Link href="/signup" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                  注册
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">团队任务管理器</h1>
        </header>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleAddTask} className="flex items-center gap-4 mb-8">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="添加新任务..."
              className="flex-grow px-4 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200 shadow-md"
            >
              添加
            </button>
          </form>

          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>所有</button>
            <button onClick={() => setFilter("todo")} className={`px-4 py-2 rounded-lg ${filter === 'todo' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>待办</button>
            <button onClick={() => setFilter("in-progress")} className={`px-4 py-2 rounded-lg ${filter === 'in-progress' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>进行中</button>
            <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>已完成</button>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">任务列表</h2>
            <ul>
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-4 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                >
                  {editingTask?.id === task.id ? (
                    <div className="flex-grow flex items-center gap-4">
                      <input
                        type="text"
                        defaultValue={task.text}
                        onBlur={(e) => handleUpdateTask(task.id, e.target.value, task.assignedTo)}
                        className="flex-grow px-3 py-2 border-2 rounded-lg bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={task.assignedTo || ""}
                        onChange={(e) => handleUpdateTask(task.id, task.text, e.target.value || null)}
                        className="px-3 py-2 border-2 rounded-lg bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">未分配</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                      <button onClick={() => setEditingTask(null)} className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600">取消</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={!!task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span
                          className={`cursor-pointer flex-grow text-lg ${
                            task.completed
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{getAssigneeName(task.assignedTo)}</span>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-sm"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200 shadow-sm"
                        >
                          删除
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
