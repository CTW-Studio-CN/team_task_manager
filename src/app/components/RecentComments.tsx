"use client";

import { useEffect, useState } from "react";
import { Comment, User } from "../lib/definitions";
import Link from "next/link";

export default function RecentComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data.slice(0, 5))); // 只获取最新的5条评论
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "未知用户";
  };

  return (
    <div style={{ backgroundColor: 'var(--card-background)' }} className="rounded-xl shadow-lg p-6">
      <h2 style={{ color: 'var(--foreground)' }} className="text-2xl font-semibold mb-4">最新评论</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--input-background)'}}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{getUserName(comment.userId)}</span>
              <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
            </div>
            <p className="truncate">{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>暂无评论。</p>
        )}
      </div>
    </div>
  );
}
