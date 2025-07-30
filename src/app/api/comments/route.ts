import { NextResponse } from "next/server";
import { comments, writeComments } from "../../lib/comments";
import { Comment } from "../../lib/definitions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");
  if (taskId) {
    const taskComments = comments.filter(
      (c) => c.taskId === parseInt(taskId)
    );
    return NextResponse.json(taskComments);
  }
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const { taskId, userId, text } = await request.json();
  const newComment: Comment = {
    id: comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
    taskId,
    userId,
    text,
    timestamp: new Date().toISOString(),
  };
  const updatedComments = [...comments, newComment];
  writeComments(updatedComments);
  return NextResponse.json(newComment, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = comments.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  const updatedComments = comments.filter((c) => c.id !== id);
  writeComments(updatedComments);

  return NextResponse.json({ message: "Comment deleted" });
}
