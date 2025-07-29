import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/projects.json');

const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(jsonData);
};

const writeData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export async function GET() {
  const projects = readData();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const projects = readData();
  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map((p: any) => p.id)) + 1 : 1,
    name,
  };
  projects.push(newProject);
  writeData(projects);
  return NextResponse.json(newProject, { status: 201 });
}
