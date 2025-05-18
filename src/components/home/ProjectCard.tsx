
import { MoreVertical, ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";

// Updated Project interface to match our database schema
export interface Project {
  id: string;
  title: string;
  thumbnail_url?: string | null;
  updated_at: string;
  is_private: boolean;
  description?: string | null;
}

interface ProjectCardProps {
  project: Project;
  onOpen: (projectId: string) => void;
}

export const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  // Format the date
  const lastEditedFormatted = project.updated_at
    ? `${formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}`
    : 'No edits';

  return (
    <div className="group relative bg-zinc-900/80 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all perspective-1000">
      <div className="transform-style-3d transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-x-[2deg]">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-zinc-600 opacity-50" />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm truncate">{project.title}</h3>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1">
              <MoreVertical className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{lastEditedFormatted}</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] border",
              project.is_private 
                ? "bg-blue-900/30 border-blue-700/30 text-blue-300" 
                : "bg-green-900/30 border-green-700/30 text-green-300"
            )}>
              {project.is_private ? 'Private' : 'Public'}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onOpen(project.id)}
        className="absolute inset-0 w-full h-full opacity-0"
        aria-label={`Open ${project.title}`}
      />
    </div>
  );
};
