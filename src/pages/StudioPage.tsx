
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import AppHeader from '@/components/AppHeader';
import StudioSidebar from '@/components/studio/StudioSidebar';
import StudioCanvas from '@/components/studio/StudioCanvas';
import StudioBottomBar from '@/components/studio/StudioBottomBar';
import { StudioRightPanel } from '@/components/studio/StudioSidePanels';
import { supabase } from '@/integrations/supabase/client';

interface Block {
  id: string;
  type: 'text' | 'image' | 'video';
}

const StudioPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const { activeProjectId, setActiveProject } = useAppStore();
  
  const [blocks, setBlocks] = useState<Block[]>([
    { id: uuidv4(), type: 'text' },
    { id: uuidv4(), type: 'image' },
    { id: uuidv4(), type: 'video' },
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // When the component mounts or projectId changes, update the app store
  useEffect(() => {
    const initializeProjectContext = async () => {
      // If we have a project ID from the URL, fetch its details and store it
      if (projectId) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('title')
            .eq('id', projectId)
            .single();
            
          if (error) {
            throw error;
          }
          
          setActiveProject(projectId, data?.title || 'Untitled');
        } catch (error) {
          console.error('Error fetching project details:', error);
        }
      }
    };
    
    initializeProjectContext();
  }, [projectId, setActiveProject]);
  
  const handleAddBlock = (type: 'text' | 'image' | 'video') => {
    const newBlock = { id: uuidv4(), type };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };
  
  const handleSelectBlock = (id: string) => {
    setSelectedBlockId(id || null);
  };
  
  // Get the type of the currently selected block
  const selectedBlockType = blocks.find(b => b.id === selectedBlockId)?.type || null;
  
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <AppHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <StudioSidebar onAddBlock={handleAddBlock} />
        
        <StudioCanvas 
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={handleSelectBlock}
        />
        
        <StudioRightPanel selectedBlockType={selectedBlockType} />
      </div>
      
      <StudioBottomBar />
    </div>
  );
};

export default StudioPage;
