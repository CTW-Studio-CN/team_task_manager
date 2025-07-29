import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

async function getSettings() {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回默认设置
    return { registrationOpen: true };
  }
}

async function saveSettings(settings: any) {
  await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const { registrationOpen } = await request.json();
  const settings = await getSettings();
  settings.registrationOpen = registrationOpen;
  await saveSettings(settings);
  return NextResponse.json(settings);
}
