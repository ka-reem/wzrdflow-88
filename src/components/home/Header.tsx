
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreditsDisplay from '@/components/CreditsDisplay';
import { useAuth } from '@/providers/AuthProvider';
import { Logo } from '@/components/ui/logo';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateProject = () => {
    navigate('/project-setup');
  };

  return (
    <header className="border-b border-zinc-800/50 bg-black/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Logo />

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-64 bg-zinc-900/50 rounded-lg pl-10 pr-4 py-2 text-sm border border-zinc-800 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits display */}
            {user && <CreditsDisplay showButton />}
            
            <Button
              onClick={handleCreateProject}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-glow-purple-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
