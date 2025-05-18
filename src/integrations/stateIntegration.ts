
import { useVideoEditorStore } from '@/store/videoEditorStore';
import { useEffect } from 'react';

/**
 * This utility function creates selectors that connect your existing state 
 * management with the Zustand video editor store
 */
export function createVideoEditorSelectors() {
  return {
    // Read video editor state
    selectProjectId: () => useVideoEditorStore.getState().projectId,
    selectProjectName: () => useVideoEditorStore.getState().projectName,
    selectIsPlaying: () => useVideoEditorStore.getState().isPlaying,
    selectCurrentTime: () => useVideoEditorStore.getState().currentTime,
    selectDuration: () => useVideoEditorStore.getState().duration,
    selectMediaItems: () => useVideoEditorStore.getState().mediaItems,
    // Add more selectors as needed
  };
}

/**
 * This hook synchronizes certain parts of your main state management
 * with the video editor state when needed
 * 
 * Example usage: 
 * 
 * // In a component that needs to sync state:
 * useSyncVideoEditorState({
 *   projectId: myReduxProjectId,
 *   onMediaItemsChange: (mediaItems) => {
 *     // Do something with updated media items in your main state
 *     dispatch(updateMediaItemsAction(mediaItems));
 *   }
 * });
 */
export function useSyncVideoEditorState(options: {
  projectId?: string | null;
  projectName?: string;
  onMediaItemsChange?: (mediaItems: any[]) => void;
  // Add more sync options as needed
}) {
  const {
    projectId: externalProjectId,
    projectName: externalProjectName,
    onMediaItemsChange,
  } = options;

  const videoEditorStore = useVideoEditorStore();
  
  // Sync project ID from external state to video editor
  useEffect(() => {
    if (externalProjectId !== undefined && externalProjectId !== videoEditorStore.projectId) {
      videoEditorStore.setProjectId(externalProjectId);
    }
  }, [externalProjectId, videoEditorStore]);
  
  // Sync project name from external state to video editor
  useEffect(() => {
    if (externalProjectName && externalProjectName !== videoEditorStore.projectName) {
      videoEditorStore.setProjectName(externalProjectName);
    }
  }, [externalProjectName, videoEditorStore]);
  
  // Subscribe to media items changes and notify external state
  useEffect(() => {
    if (onMediaItemsChange) {
      // Fix: In Zustand v5+, subscribe method takes a single callback function
      const unsubscribe = useVideoEditorStore.subscribe((state) => {
        if (onMediaItemsChange) {
          onMediaItemsChange(state.mediaItems);
        }
      });
      
      return unsubscribe;
    }
  }, [onMediaItemsChange]);
}

/**
 * Returns actions that can be dispatched to update the video editor state
 * from your existing state management
 */
export function getVideoEditorActions() {
  return {
    setProjectId: (id: string | null) => useVideoEditorStore.getState().setProjectId(id),
    setProjectName: (name: string) => useVideoEditorStore.getState().setProjectName(name),
    addMediaItem: (item: any) => useVideoEditorStore.getState().addMediaItem(item),
    play: () => useVideoEditorStore.getState().play(),
    pause: () => useVideoEditorStore.getState().pause(),
    // Add more actions as needed
  };
}
