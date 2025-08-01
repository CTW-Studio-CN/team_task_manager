export type Task = {
  id: number;
  text: string;
  completed: boolean;
  status: 'todo' | 'inprogress' | 'done';
  assignedTo: string[];
  tags: { name: string; color: string }[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  projectId?: number;
  attachments?: { name: string; url: string }[];
};

export type Project = {
  id: number;
  name: string;
  description?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
};

export type Settings = {
  registrationOpen: boolean;
};

export type Comment = {
  id: number;
  taskId: number;
  userId: string;
  text: string;
  timestamp: string;
};
