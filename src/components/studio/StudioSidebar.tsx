import { useState, useRef, useEffect } from 'react';
import { 
  Plus, History, Layers, Inbox, MessageCircle, Settings, HelpCircle, 
  Type, Image as ImageIcon, Video, Box, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import FlowSelector, { Flow } from './FlowSelector';
import UpgradeModal from './UpgradeModal';

interface StudioSidebarProps {
  onAddBlock: (blockType: 'text' | 'image' | 'video') => void;
}

// Mock flows
const MOCK_FLOWS: Flow[] = [
  { id: 'game-character', name: 'Game Character Generation', blocks: 139 },
  { id: 'magic-frogs', name: 'magic frogs', blocks: 9 },
  { id: 'cinematic', name: 'Cinematic Portrait', blocks: 9 },
  { id: 'branching', name: 'Branching', blocks: 79 },
  { id: 'aesthetic', name: 'Aesthetic Style Extraction', blocks: 39 },
  { id: 'love-me', name: 'LOVE ME, LOVE ME NOT', blocks: 3 },
];

const StudioSidebar = ({ onAddBlock }: StudioSidebarProps) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showFlowSelector, setShowFlowSelector] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  const addMenuRef = useRef<HTMLDivElement>(null);
  const flowSelectorRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (event: MouseEvent) => {
    if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
      setShowAddMenu(false);
    }
    
    if (flowSelectorRef.current && !flowSelectorRef.current.contains(event.target as Node)) {
      setShowFlowSelector(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleToolClick = (toolId: string) => {
    setActiveTool(activeTool === toolId ? null : toolId);
    
    if (toolId === 'add') {
      setShowAddMenu(!showAddMenu);
      setShowFlowSelector(false);
    } else if (toolId === 'templates') {
      setShowFlowSelector(!showFlowSelector);
      setShowAddMenu(false);
    } else if (toolId === 'assets') {
      setShowAssetsModal(true);
      setShowAddMenu(false);
      setShowFlowSelector(false);
    } else {
      setShowAddMenu(false);
      setShowFlowSelector(false);
    }
  };
  
  const handleSelectFlow = (flowId: string) => {
    console.log(`Selected flow: ${flowId}`);
    setShowFlowSelector(false);
  };

  return (
    <div className="h-full w-16 bg-black border-r border-zinc-800/50 flex flex-col">
      <div className="flex-1 flex flex-col items-center pt-4 gap-6">
        {/* Add Button with Dropdown */}
        <div className="relative" ref={addMenuRef}>
          <button 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              activeTool === 'add' ? "bg-white text-black" : "bg-zinc-900 hover:bg-zinc-800 text-white"
            )}
            onClick={() => handleToolClick('add')}
          >
            <Plus className="h-5 w-5" />
          </button>
          
          <AnimatePresence>
            {showAddMenu && (
              <motion.div 
                className="absolute left-14 top-0 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-zinc-500 px-3 py-2">ADD BLOCK</h3>
                  
                  <button 
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-md text-white text-sm"
                    onClick={() => {
                      onAddBlock('text');
                      setShowAddMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-800 w-7 h-7 rounded-full flex items-center justify-center">
                        <Type className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span>Text</span>
                    </div>
                    <span className="text-xs text-zinc-500">T</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-md text-white text-sm"
                    onClick={() => {
                      onAddBlock('image');
                      setShowAddMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-800 w-7 h-7 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span>Image</span>
                    </div>
                    <span className="text-xs text-zinc-500">I</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-md text-white text-sm"
                    onClick={() => {
                      onAddBlock('video');
                      setShowAddMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-800 w-7 h-7 rounded-full flex items-center justify-center">
                        <Video className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span>Video</span>
                    </div>
                    <span className="text-xs text-zinc-500">V</span>
                  </button>
                  
                  <div className="border-t border-zinc-800 my-1"></div>
                  
                  <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-md text-white text-sm">
                    <div className="flex items-center gap-3">
                      <span>Navigate / Select</span>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-800 rounded-md text-white text-sm">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Learn about Blocks</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Templates/Flows Button with Dropdown */}
        <div className="relative" ref={flowSelectorRef}>
          <button 
            className={cn(
              "w-10 h-10 flex items-center justify-center text-zinc-500 transition-colors",
              activeTool === 'templates' ? "text-white" : "hover:text-zinc-300"
            )}
            onClick={() => handleToolClick('templates')}
            title="Templates & Flows"
          >
            <Box className="h-5 w-5" />
          </button>
          
          <AnimatePresence>
            {showFlowSelector && (
              <motion.div 
                className="absolute left-14 top-0 w-72 z-50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FlowSelector 
                  flows={MOCK_FLOWS}
                  onFlowSelect={handleSelectFlow}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Assets Button */}
        <button 
          className={cn(
            "w-10 h-10 flex items-center justify-center text-zinc-500 transition-colors",
            activeTool === 'assets' ? "text-white" : "hover:text-zinc-300"
          )}
          onClick={() => handleToolClick('assets')}
          title="Assets"
        >
          <Layers className="h-5 w-5" />
        </button>
        
        {/* Other sidebar icons */}
        <button 
          className={cn(
            "w-10 h-10 flex items-center justify-center text-zinc-500 transition-colors",
            activeTool === 'history' ? "text-white" : "hover:text-zinc-300"
          )}
          onClick={() => handleToolClick('history')}
          title="History"
        >
          <History className="h-5 w-5" />
        </button>
        
        <button 
          className={cn(
            "w-10 h-10 flex items-center justify-center text-zinc-500 transition-colors",
            activeTool === 'inbox' ? "text-white" : "hover:text-zinc-300"
          )}
          onClick={() => handleToolClick('inbox')}
          title="Inbox"
        >
          <Inbox className="h-5 w-5" />
        </button>
        
        <button 
          className={cn(
            "w-10 h-10 flex items-center justify-center text-zinc-500 transition-colors",
            activeTool === 'chat' ? "text-white" : "hover:text-zinc-300"
          )}
          onClick={() => handleToolClick('chat')}
          title="Chat"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        
        <button 
          className={cn(
            "w-10 h-10 flex items-center justify-center text-zinc-500 transition-colors",
            activeTool === 'settings' ? "text-white" : "hover:text-zinc-300"
          )}
          onClick={() => handleToolClick('settings')}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
      
      {/* Bottom logo */}
      <div className="p-3 flex justify-center mb-4">
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
          <img src="/lovable-uploads/075616c6-e4fc-4662-a4b8-68b746782b65.png" alt="Logo" className="w-8 h-8" />
        </div>
      </div>
      
      {/* Assets Modal */}
      <UpgradeModal 
        isOpen={showAssetsModal}
        onClose={() => setShowAssetsModal(false)}
        title="Assets"
        description="Upgrade to upload and store your own media"
        icon={<Box className="h-12 w-12 text-zinc-400" />}
      />
    </div>
  );
};

export default StudioSidebar;
