import fs from "fs";
import path from "path";
import { Comment } from "./definitions";

const commentsFilePath = path.join(process.cwd(), "data", "comments.json");

function readComments(): Comment[] {
  const jsonData = fs.readFileSync(commentsFilePath, "utf-8");
  return JSON.parse(jsonData);
}

export let comments: Comment[] = readComments();

export function writeComments(data: Comment[]) {
  fs.writeFileSync(commentsFilePath, JSON.stringify(data, null, 2));
  comments = data;
}
