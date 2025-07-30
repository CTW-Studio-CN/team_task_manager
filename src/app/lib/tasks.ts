import fs from "fs";
import path from "path";
import { Task } from "./definitions";

const tasksFilePath = path.join(process.cwd(), "data", "tasks.json");

function readTasks(): Task[] {
  try {
    const jsonData = fs.readFileSync(tasksFilePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Failed to read tasks data:', error);
    return [];
  }
}

export let tasks: Task[] = readTasks();

export function getTasks({ projectId }: { projectId?: number } = {}): Task[] {
  const allTasks = readTasks();
  if (projectId) {
    return allTasks.filter(task => task.projectId === projectId);
  }
  return allTasks;
}

export function writeTasks(data: Task[]) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(data, null, 2));
  tasks = data;
}
