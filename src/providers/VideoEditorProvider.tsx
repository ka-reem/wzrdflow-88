import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useVideoEditorStore } from '@/store/videoEditorStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useParams } from "react-router-dom";

// Create context with a more complete type definition
type VideoEditorContextType = {
  isLoading: boolean;
  // We could include more shared state or methods here as needed
};

// Create context with proper typing
const VideoEditorContext = createContext<VideoEditorContextType | null>(null);

// Provider component
export function VideoEditorProvider({ children }: { children: ReactNode }) {
  const { projectId, setProjectId, setProjectName, addMediaItem, reset } = useVideoEditorStore();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  // Load project data if we have a project ID (either from params or stored)
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        // Check if we have a project ID in URL params
        const urlProjectId = params.projectId;
        
        if (urlProjectId) {
          setProjectId(urlProjectId);
        }
        
        // If we have a project ID (from params or previously set), load the project
        if (projectId) {
          setIsLoading(true);
          
          // Fetch project details
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
            
          if (projectError) throw projectError;
          
          if (projectData) {
            setProjectName(projectData.title);
            
            // Fetch media items for this project
            const { data: mediaItems, error: mediaError } = await supabase
              .from('media_items')
              .select('*')
              .eq('project_id', projectId);
              
            if (mediaError) throw mediaError;
            
            // Add media items to the store
            if (mediaItems && mediaItems.length > 0) {
              mediaItems.forEach(item => {
                // Ensure media_type is one of the allowed types
                const mediaType = validateMediaType(item.media_type);
                
                addMediaItem({
                  id: item.id,
                  type: mediaType,
                  url: item.url || '',
                  name: item.name,
                  duration: item.duration,
                  startTime: item.start_time,
                  endTime: item.end_time
                });
              });
            }
            
            // We could also load tracks, track items, and keyframes here
          }
        }
      } catch (error) {
        console.error('Error loading project data:', error);
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, params.projectId]);
  
  // Helper function to validate media type
  const validateMediaType = (type: string): 'video' | 'image' | 'audio' => {
    if (type === 'video' || type === 'image' || type === 'audio') {
      return type;
    }
    // Default to 'image' if type is invalid
    console.warn(`Invalid media type: ${type}, defaulting to 'image'`);
    return 'image';
  };
  
  // Clean up when unmounting
  useEffect(() => {
    return () => {
      // Reset the store when the provider is unmounted
      reset();
    };
  }, []);

  // Create context value with proper shape
  const contextValue = {
    isLoading
    // We can add more shared state or methods here as needed
  };

  return (
    <VideoEditorContext.Provider value={contextValue}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        children
      )}
    </VideoEditorContext.Provider>
  );
}

// Hook to use the context state (not the store directly)
export function useVideoEditorContext() {
  const context = useContext(VideoEditorContext);
  if (context === null) {
    throw new Error('useVideoEditorContext must be used within a VideoEditorProvider');
  }
  return context;
}

// Hook to use the store (keep this for compatibility with existing components)
export function useVideoEditor() {
  // Ensure we're within the provider
  useContext(VideoEditorContext);
  return useVideoEditorStore();
}

// Export the raw store too for integration with external state if needed
export { useVideoEditorStore };
