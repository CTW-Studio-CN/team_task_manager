"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Task, User, Comment } from "./lib/definitions";
import Statistics from "./components/Statistics";
import ProjectSelector from "./components/ProjectSelector";
import RecentComments from "./components/RecentComments";

export default function Home() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "done">("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const fetchTasks = (projectId: number | null = null) => {
    let url = "/api/tasks";
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  };

  useEffect(() => {
    fetchTasks(selectedProjectId);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [selectedProjectId]);

  useEffect(() => {
    let filtered = tasks;
    if (filter !== "all") {
      filtered = tasks.filter((task) => task.status === filter);
    }
    // 将已完成的任务排在最后
    filtered.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === "" || !session) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newTaskText,
        projectId: selectedProjectId,
      }),
    });
    if (res.ok) {
      fetchTasks(selectedProjectId);
      setNewTaskText("");
    }
  };

  const handleUpdateTask = async (task: Task) => {
    if (!session) return;
    const res = await fetch(`/api/tasks`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      fetchTasks(selectedProjectId);
    }
    setEditingTask(null);
  };

  const toggleTaskCompletion = (task: Task) => {
    handleUpdateTask({
      ...task,
      completed: !task.completed,
      status: !task.completed ? "done" : "todo",
    });
  };

  const fetchComments = async (taskId: number) => {
    const res = await fetch(`/api/comments?taskId=${taskId}`);
    const data = await res.json();
    setComments(data);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    fetchComments(task.id);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() === "" || !session || !selectedTask) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: selectedTask.id,
        userId: (session.user as any).id,
        text: newCommentText,
      }),
    });
    if (res.ok) {
      fetchComments(selectedTask.id);
      setNewCommentText("");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!session || (session.user as any).role !== 'admin') return;
    const res = await fetch('/api/comments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: commentId }),
    });
    if (res.ok && selectedTask) {
      fetchComments(selectedTask.id);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!session) return;
    const res = await fetch(`/api/tasks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchTasks(selectedProjectId);
    }
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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 order-1 lg:order-1 flex flex-col gap-8">
            <Statistics />
            <div style={{ backgroundColor: 'var(--card-background)' }} className="rounded-xl shadow-lg p-6">
              <ProjectSelector onSelectProject={setSelectedProjectId} />
            </div>
          </div>
          <div className="lg:w-1/2 order-2 lg:order-2">
            <header className="text-center mb-8 mt-8">
              <h1 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>团队任务管理器</h1>
            </header>

            <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: 'var(--card-background)' }}>
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
            <button onClick={() => setFilter("inprogress")} className={`px-4 py-2 rounded-lg ${filter === 'inprogress' ? '' : ''}`} style={{ backgroundColor: filter === 'inprogress' ? 'var(--primary-color)' : 'var(--secondary-button-bg)', color: filter === 'inprogress' ? 'white' : 'var(--secondary-button-text)' }}>进行中</button>
            <button onClick={() => setFilter("done")} className={`px-4 py-2 rounded-lg ${filter === 'done' ? '' : ''}`} style={{ backgroundColor: filter === 'done' ? 'var(--primary-color)' : 'var(--secondary-button-bg)', color: filter === 'done' ? 'white' : 'var(--secondary-button-text)' }}>已完成</button>
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
                          onBlur={(e) => handleUpdateTask({ ...task, text: e.target.value })}
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
                                  handleUpdateTask({ ...task, assignedTo: newAssignedTo });
                                }}
                              />
                              {user.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">标签:</h3>
                        {task.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              defaultValue={tag.name}
                              onBlur={(e) => {
                                const newTags = [...task.tags];
                                newTags[index].name = e.target.value;
                                handleUpdateTask({ ...task, tags: newTags });
                              }}
                              className="flex-grow px-3 py-2 border-2 rounded-lg"
                              style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)' }}
                            />
                            <input
                              type="color"
                              defaultValue={tag.color}
                              onBlur={(e) => {
                                const newTags = [...task.tags];
                                newTags[index].color = e.target.value;
                                handleUpdateTask({ ...task, tags: newTags });
                              }}
                              className="w-10 h-10 p-1 border-2 rounded-lg"
                              style={{ borderColor: 'var(--border-color)' }}
                            />
                            <button
                              onClick={() => {
                                const newTags = task.tags.filter((_, i) => i !== index);
                                handleUpdateTask({ ...task, tags: newTags });
                              }}
                              className="px-2 py-1 rounded-lg"
                              style={{ backgroundColor: 'var(--red-color)', color: 'white' }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newTags = [...task.tags, { name: '新标签', color: '#ffffff' }];
                            handleUpdateTask({ ...task, tags: newTags });
                          }}
                          className="px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        >
                          添加标签
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">截止日期:</h3>
                          <input
                            type="date"
                            defaultValue={task.dueDate || ''}
                            onBlur={(e) => handleUpdateTask({ ...task, dueDate: e.target.value })}
                            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)]"
                            style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)' }}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">优先级:</h3>
                          <select
                            defaultValue={task.priority || 'medium'}
                            onBlur={(e) => handleUpdateTask({ ...task, priority: e.target.value as 'low' | 'medium' | 'high' })}
                            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)]"
                            style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)' }}
                          >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={() => setEditingTask(null)} className="font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--text-muted)', color: 'white' }}>完成编辑</button>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">附件:</h3>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const newAttachments = files.map(file => ({
                              name: file.name,
                              url: URL.createObjectURL(file),
                            }));
                            handleUpdateTask({ ...task, attachments: [...(task.attachments || []), ...newAttachments] });
                          }}
                          className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)]"
                          style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border-color)' }}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {task.attachments?.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1">
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm">{attachment.name}</a>
                              <button
                                onClick={() => {
                                  const newAttachments = task.attachments?.filter((_, i) => i !== index);
                                  handleUpdateTask({ ...task, attachments: newAttachments });
                                }}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={task?.completed ?? false}
                          onChange={() => toggleTaskCompletion(task)}
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          {task.attachments?.map((attachment, index) => (
                            <a key={index} href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{attachment.name}</a>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {task.tags.map(tag => (
                            <span key={tag.name} className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded" style={{ backgroundColor: tag.color, color: 'white' }}>{tag.name}</span>
                          ))}
                        </div>
                        {task.priority && (
                          <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded capitalize ${
                            task.priority === 'high' ? 'bg-red-200 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            截止日期: {task.dueDate}
                          </span>
                        )}
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{getAssigneeNames(task.assignedTo)}</span>
                        {session && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleSelectTask(task)}
                              className="font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm"
                              style={{ backgroundColor: 'var(--blue-tag-bg)', color: 'var(--blue-tag-text)' }}
                            >
                              评论
                            </button>
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
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </div>

          {selectedTask && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: 'var(--card-background)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    评论: {selectedTask.text}
                  </h2>
                  <button onClick={() => setSelectedTask(null)} className="font-bold">X</button>
                </div>
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 mb-2 rounded-lg" style={{ backgroundColor: 'var(--input-background)'}}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{users.find(u => u.id === comment.userId)?.name || '未知用户'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
                          {(session?.user as any)?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
                {session && (
                  <form onSubmit={handleAddComment} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="添加评论..."
                      className="flex-grow px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] transition duration-200"
                      style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)' }}
                    />
                    <button
                      type="submit"
                      className="font-semibold px-6 py-3 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] focus:ring-opacity-75 transition duration-200 shadow-md"
                      style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                    >
                      发送
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
          </div>
        </div>
        <div className="lg:w-1/4 order-3 lg:order-3 flex-col gap-8">
          <RecentComments />
        </div>
      </div>
      </main>
    </div>
  );
}
