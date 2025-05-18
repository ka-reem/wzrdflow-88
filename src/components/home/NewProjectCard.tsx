
import { Plus } from 'lucide-react';

interface NewProjectCardProps {
  onClick: () => void;
}

export const NewProjectCard = ({ onClick }: NewProjectCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-zinc-900/40 backdrop-blur-sm rounded-lg overflow-hidden border border-dashed border-zinc-700 hover:border-purple-500/50 transition-all perspective-1000 h-full"
    >
      <div className="transform-style-3d transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-x-[2deg] h-full flex flex-col">
        <div className="w-full aspect-video bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
        </div>
        <div className="p-3 flex-grow flex items-center justify-center">
          <h3 className="font-medium text-sm text-purple-300 group-hover:text-purple-200 transition-colors">Create a new project</h3>
        </div>
      </div>
    </button>
  );
};
