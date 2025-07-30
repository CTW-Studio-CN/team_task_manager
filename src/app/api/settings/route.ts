import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Settings } from '../../lib/definitions';

const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

async function getSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf-8');
    return JSON.parse(data) as Settings;
  } catch {
    // 如果文件不存在，返回默认设置
    return { registrationOpen: true };
  }
}

async function saveSettings(settings: Settings) {
  await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const { registrationOpen } = await request.json() as { registrationOpen: boolean };
  const settings = await getSettings();
  settings.registrationOpen = registrationOpen;
  await saveSettings(settings);
  return NextResponse.json(settings);
}
