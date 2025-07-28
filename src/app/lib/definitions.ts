export type Task = {
  id: number;
  text: string;
  completed: boolean;
  status: 'todo' | 'inprogress' | 'done';
  assignedTo: string[];
  tags: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
};

export type Comment = {
  id: number;
  taskId: number;
  userId: string;
  text: string;
  timestamp: string;
};
