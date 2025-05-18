
import { useState } from 'react';
import { Minus, Plus, Maximize, ChevronRight, CircleDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress?: number;
}

const StudioBottomBar = () => {
  const [zoom, setZoom] = useState(100);
  const [tasks, setTasks] = useState<Task[]>([]); // No active tasks initially
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  
  const activeTaskCount = tasks.filter(task => task.status === 'active').length;
  
  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };
  
  const handleZoomOut = () => {
    if (zoom > 25) setZoom(zoom - 25);
  };
  
  const handleResetZoom = () => {
    setZoom(100);
  };

  return (
    <div className="w-full bg-black border-t border-zinc-800/50 px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-400 hover:text-white"
          onClick={handleZoomOut}
          disabled={zoom <= 25}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 text-zinc-400 hover:text-white px-2 py-0"
          onClick={handleResetZoom}
        >
          <span className="text-sm">{zoom}%</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-400 hover:text-white"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-400 hover:text-white ml-1"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <span className="text-zinc-600 text-xs ml-2">2K</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className={cn(
            "text-zinc-400 hover:text-white",
            activeTaskCount > 0 && "text-zinc-300"
          )}
          onClick={() => setIsTasksExpanded(!isTasksExpanded)}
        >
          Tasks <span className={cn("ml-1", activeTaskCount > 0 ? "text-blue-400" : "text-zinc-600")}>{activeTaskCount} active</span>
        </Button>
        <ChevronRight className={cn(
          "h-4 w-4 text-zinc-600 transition-transform", 
          isTasksExpanded && "rotate-90"
        )} />
        
        {isTasksExpanded && activeTaskCount > 0 && (
          <div className="absolute bottom-12 right-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-xl w-80">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Active Tasks</h3>
            <div className="space-y-3">
              {tasks.filter(task => task.status === 'active').map(task => (
                <div key={task.id} className="flex items-center">
                  <CircleDashed className="h-4 w-4 text-blue-400 animate-spin mr-2" />
                  <div className="flex-1">
                    <div className="text-xs text-zinc-300">{task.name}</div>
                    <div className="h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${task.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioBottomBar;
