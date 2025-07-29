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

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedProjectId(projectId);
    onSelectProject(projectId);
  };

  return (
    <div className="mb-4">
      <label htmlFor="project-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        选择项目
      </label>
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
  );
}
