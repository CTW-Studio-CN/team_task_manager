import { useState, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
}

interface ProjectSelectorProps {
  onSelectProject: (projectId: number | null) => void;
}

export default function ProjectSelector({ onSelectProject }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedProjectId(projectId);
    onSelectProject(projectId);
    setEditingProject(null);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() === '') return;
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProjectName }),
    });
    if (res.ok) {
      fetchProjects();
      setNewProjectName('');
    }
  };

  const handleUpdateProject = async (project: Project) => {
    const res = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (res.ok) {
      fetchProjects();
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    const res = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: projectId }),
    });
    if (res.ok) {
      fetchProjects();
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
        onSelectProject(null);
      }
    }
  };

  return (
    <div className="mb-4">
      <h2 style={{ color: 'var(--foreground)' }} className="text-2xl font-semibold mb-4">选择项目</h2>
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          <select
            id="project-selector"
            value={selectedProjectId || ''}
            onChange={handleSelectChange}
            style={{
              backgroundColor: 'var(--input-background)',
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-2 rounded-lg focus:outline-none focus:ring-2 ring-[var(--ring-color)] transition duration-200"
          >
            <option value="">所有项目</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        {selectedProjectId && (
          <div className="flex-shrink-0 flex gap-2">
            <button onClick={() => setEditingProject(projects.find(p => p.id === selectedProjectId) || null)} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--yellow-color)', color: 'white' }}>编辑</button>
            <button onClick={() => handleDeleteProject(selectedProjectId)} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--red-color)', color: 'white' }}>删除</button>
          </div>
        )}
      </div>

      {editingProject && (
        <div className="mt-4">
          <input
            type="text"
            defaultValue={editingProject.name}
            onBlur={(e) => handleUpdateProject({ ...editingProject, name: e.target.value })}
            className="w-full px-3 py-2 border-2 rounded-lg"
            style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)' }}
          />
        </div>
      )}

      <form onSubmit={handleAddProject} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="新项目名称"
          className="flex-grow px-3 py-2 border-2 rounded-lg"
          style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)' }}
        />
        <button type="submit" className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>添加</button>
      </form>
    </div>
  );
}
