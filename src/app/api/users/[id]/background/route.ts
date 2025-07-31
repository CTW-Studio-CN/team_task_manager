import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/app/lib/users';
import { User } from '@/app/lib/definitions';

export async function POST(
  req: NextRequest,
  { params }: any
) {
  const { id } = params;
  const users = readUsers();
  const user = users.find((u: User) => u.id === id);

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const data = await req.json();
  const { image } = data;

  if (!image) {
    return NextResponse.json(
      { message: 'Image data is required' },
      { status: 400 }
    );
  }

  user.backgroundImage = image;
  writeUsers(users);

  return NextResponse.json({ message: 'Background image updated' });
}
