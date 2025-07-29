import { NextRequest, NextResponse } from "next/server";
import { getTasks, writeTasks, tasks } from "../../lib/tasks";
import { Task } from "../../lib/definitions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const tasks = getTasks({ projectId: projectId ? Number(projectId) : undefined });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { text, assignedTo, tags, dueDate, priority, projectId } = await request.json();
  const newTask: Task = {
    id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    text,
    completed: false,
    status: "todo",
    assignedTo: assignedTo || [],
    tags: tags || [],
    dueDate: dueDate || null,
    priority: priority || "medium",
    projectId: projectId || null,
  };
  const updatedTasks = [...tasks, newTask];
  writeTasks(updatedTasks);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedTask: Task = await request.json();
  const index = tasks.findIndex((t) => t.id === updatedTask.id);

  if (index === -1) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const updatedTasks = [...tasks];
  updatedTasks[index] = { ...updatedTasks[index], ...updatedTask };
  writeTasks(updatedTasks);

  return NextResponse.json(updatedTasks[index]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const updatedTasks = tasks.filter((t) => t.id !== id);
  writeTasks(updatedTasks);

  return NextResponse.json({ message: "Task deleted" });
}
