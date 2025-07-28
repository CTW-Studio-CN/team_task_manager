import fs from "fs";
import path from "path";
import { Task } from "./definitions";

const tasksFilePath = path.join(process.cwd(), "data", "tasks.json");

function readTasks(): Task[] {
  const jsonData = fs.readFileSync(tasksFilePath, "utf-8");
  return JSON.parse(jsonData);
}

export let tasks: Task[] = readTasks();

export function writeTasks(data: Task[]) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(data, null, 2));
  tasks = data;
}
