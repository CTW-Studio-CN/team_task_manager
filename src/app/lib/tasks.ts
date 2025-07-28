import fs from "fs";
import path from "path";

const tasksFilePath = path.join(process.cwd(), "data", "tasks.json");

function readTasks() {
  const jsonData = fs.readFileSync(tasksFilePath, "utf-8");
  return JSON.parse(jsonData);
}

export let tasks = readTasks();

export function writeTasks(data: any) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(data, null, 2));
  tasks = data;
}
