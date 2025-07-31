import { NextResponse } from 'next/server';
import { users, writeUsers } from '../../../../lib/users';
import { ThemeSettings } from '../../../../lib/definitions';

export async function GET(
  request: Request,
  { params }: any
) {
  const { id } = params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Assuming theme settings are stored directly on the user object or a sub-object
  // For now, let's return a default or an empty object if not found
  const themeSettings: ThemeSettings = user.themeSettings || {
    darkMode: false,
    primaryColor: 'blue',
    transparency: 1,
    wallpaper: '',
  };

  return NextResponse.json(themeSettings);
}

export async function PATCH(
  request: Request,
  { params }: any
) {
  const { id } = params;
  const updatedSettings: Partial<ThemeSettings> = await request.json();

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const user = users[userIndex];
  const newThemeSettings: ThemeSettings = {
    darkMode: user.themeSettings?.darkMode ?? false,
    primaryColor: user.themeSettings?.primaryColor ?? 'blue',
    transparency: user.themeSettings?.transparency ?? 1,
    wallpaper: user.themeSettings?.wallpaper ?? '',
    ...updatedSettings,
  };

  const updatedUser = { ...user, themeSettings: newThemeSettings };
  const updatedUsers = [...users];
  updatedUsers[userIndex] = updatedUser;

  writeUsers(updatedUsers);

  return NextResponse.json(newThemeSettings);
}
