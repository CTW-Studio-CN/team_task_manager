import { NextResponse } from "next/server";
import { tasks, writeTasks } from "../../lib/tasks";

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  writeTasks(body);
  return NextResponse.json({ message: "Tasks updated" });
}
