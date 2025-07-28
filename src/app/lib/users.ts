import fs from "fs";
import path from "path";
import { User } from "./definitions";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

function readUsers(): User[] {
  const jsonData = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(jsonData);
}

export let users: User[] = readUsers();

export function writeUsers(data: User[]) {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
  users = data;
}
