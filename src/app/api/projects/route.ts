import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Project } from '../../lib/definitions';

const dataFilePath = path.join(process.cwd(), 'data/projects.json');

const readData = (): Project[] => {
  const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(jsonData) as Project[];
};

const writeData = (data: Project[]) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export async function GET() {
  const projects = readData();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const projects = readData();
  const newProject: Project = {
    id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
    name,
  };
  projects.push(newProject);
  writeData(projects);
  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const projects = readData();
  const projectIndex = projects.findIndex((p) => p.id === id);
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
  const projectExists = projects.some((p) => p.id === id);
  if (!projectExists) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }
  projects = projects.filter((p) => p.id !== id);
  writeData(projects);
  return NextResponse.json({ message: 'Project deleted successfully' });
}
