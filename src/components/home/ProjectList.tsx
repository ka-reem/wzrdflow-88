
import { Project, ProjectCard } from './ProjectCard';
import { NewProjectCard } from './NewProjectCard';

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export const ProjectList = ({ projects, onOpenProject, onCreateProject }: ProjectListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpen={onOpenProject}
        />
      ))}
      <NewProjectCard onClick={onCreateProject} />
    </div>
  );
};
