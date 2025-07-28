import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

function readUsers() {
  const jsonData = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(jsonData);
}

export let users = readUsers();

export function writeUsers(data: any) {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
  users = data;
}
