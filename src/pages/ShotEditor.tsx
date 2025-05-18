
import React from 'react';
import VideoEditor from '@/components/editor/VideoEditor';
import { VideoEditorProvider } from '@/providers/VideoEditorProvider';
import { useParams } from 'react-router-dom';
import { useSyncVideoEditorState } from '@/integrations/stateIntegration';

interface ShotEditorProps {
  viewMode: 'studio' | 'storyboard' | 'editor';
  setViewMode: (mode: 'studio' | 'storyboard' | 'editor') => void;
}

const ShotEditor = ({ viewMode, setViewMode }: ShotEditorProps) => {
  const params = useParams();
  const projectId = params.projectId;
  
  // Use the integration to sync the state
  useSyncVideoEditorState({
    projectId: projectId || null,
    projectName: 'Untitled Project',
    onMediaItemsChange: (mediaItems) => {
      // Here you would connect to your external state management
      console.log('Media items changed:', mediaItems);
    }
  });

  return (
    <div className="flex flex-col h-screen bg-[#0A0D16]">
      <div className="flex-1 bg-[#0F1117] overflow-hidden">
        <VideoEditorProvider>
          <VideoEditor />
        </VideoEditorProvider>
      </div>
    </div>
  );
};

export default ShotEditor;
