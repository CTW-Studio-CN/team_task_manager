'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [background, setBackground] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    } else {
      // Fetch user data to pre-fill the form
      const fetchUserData = async () => {
        const res = await fetch(`/api/users/${session.user.id}`);
        if (res.ok) {
          const userData = await res.json();
          setUsername(userData.name);
          setEmail(userData.email);
          setBackground(userData.background || '');
        }
      };
      fetchUserData();
    }
  }, [session, status, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password && password !== confirmPassword) {
      setMessage('密码和确认密码不匹配。');
      return;
    }

    const res = await fetch(`/api/users/${session?.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, email, password: password || undefined }),
    });

    if (res.ok) {
      setMessage('个人资料更新成功！');
    } else {
      const errorData = await res.json();
      setMessage(`更新失败: ${errorData.message || '未知错误'}`);
    }
  };

  const handleBackgroundUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch(`/api/users/${session?.user.id}/background`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ background }),
    });

    if (res.ok) {
      setMessage('背景更新成功！');
    } else {
      const errorData = await res.json();
      setMessage(`背景更新失败: ${errorData.message || '未知错误'}`);
    }
  };

  if (status === 'loading') {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">用户设置</h1>

      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('成功') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">个人资料</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">新密码 (留空则不修改)</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">确认新密码</label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              更新个人资料
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">背景设置</h2>
          <form onSubmit={handleBackgroundUpdate} className="space-y-4">
            <div>
              <label htmlFor="background" className="block text-sm font-medium text-gray-700">背景图片URL或颜色值</label>
              <input
                type="text"
                id="background"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="例如: #f0f0f0 或 https://example.com/bg.jpg"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              更新背景
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
