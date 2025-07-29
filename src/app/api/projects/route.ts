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

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const projects = readData();
  const projectIndex = projects.findIndex((p: any) => p.id === id);
  if (projectIndex === -1) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }
  projects[projectIndex].name = name;
  writeData(projects);
  return NextResponse.json(projects[projectIndex]);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  let projects = readData();
  const projectExists = projects.some((p: any) => p.id === id);
  if (!projectExists) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }
  projects = projects.filter((p: any) => p.id !== id);
  writeData(projects);
  return NextResponse.json({ message: 'Project deleted successfully' });
}
