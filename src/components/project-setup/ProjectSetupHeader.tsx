
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const ProjectSetupHeader = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/home');
  };
  
  return (
    <header className="w-full bg-[#0B0D14] border-b border-[#1D2130] px-6 py-3 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={handleBack}>
          <Logo size="sm" showVersion={false} />
          <span className="ml-6 text-zinc-400">Visualize your concept</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="bg-transparent hover:bg-transparent text-blue-500">
            Upgrade
          </Button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            G
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectSetupHeader;
