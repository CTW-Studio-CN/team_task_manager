import { NextResponse } from "next/server";
import { users, writeUsers } from "../../lib/users";
import { User } from "../../lib/definitions";

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return NextResponse.json(
      { message: "User with this email already exists" },
      { status: 409 }
    );
  }

  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    password, // In a real app, hash this password
    role: "user",
  };

  const updatedUsers = [...users, newUser];
  writeUsers(updatedUsers);

  return NextResponse.json(newUser, { status: 201 });
}
