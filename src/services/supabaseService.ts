
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from '@/store/videoEditorStore';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Project types
export interface Project {
  id: string;
  title: string;
  description?: string;
  aspect_ratio?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

// Track types
export interface Track {
  id: string;
  project_id: string;
  type: 'video' | 'audio';
  label: string;
  position: number;
  locked?: boolean;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Track item types
export interface TrackItem {
  id: string;
  track_id: string;
  media_item_id: string;
  start_time: number;
  duration: number;
  position_x?: number;
  position_y?: number;
  scale?: number;
  rotation?: number;
  z_index?: number;
  created_at?: string;
  updated_at?: string;
}

// Keyframe types
export interface Keyframe {
  id: string;
  track_item_id: string;
  timestamp: number;
  properties: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Helper functions to validate and convert types
const validateTrackType = (type: string): 'video' | 'audio' => {
  if (type === 'video' || type === 'audio') {
    return type;
  }
  console.warn(`Invalid track type: ${type}, defaulting to 'video'`);
  return 'video';
};

const convertJsonToRecord = (json: Json): Record<string, any> => {
  if (typeof json === 'object' && json !== null) {
    return json as Record<string, any>;
  }
  console.warn('Invalid properties JSON, defaulting to empty object');
  return {};
};

// Error handling helper
const handleError = (error: any, action: string) => {
  console.error(`Error ${action}:`, error);
  toast.error(`Failed to ${action.toLowerCase()}`);
  throw error;
};

// Projects
export const projectService = {
  async find(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, 'fetching project');
      return null;
    }
  },
  
  async list(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, 'listing projects');
      return [];
    }
  },
  
  async create(project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          user_id: user.id
        })
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      handleError(error, 'creating project');
      throw error;
    }
  },
  
  async update(id: string, updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'updating project');
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'deleting project');
    }
  }
};

// Media Items
export const mediaService = {
  async find(id: string): Promise<MediaItem | null> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Convert to MediaItem format
      return data ? {
        id: data.id,
        type: validateMediaType(data.media_type), // Reusing the function from VideoEditorProvider
        url: data.url || '',
        name: data.name,
        duration: data.duration,
        startTime: data.start_time,
        endTime: data.end_time
      } : null;
    } catch (error) {
      handleError(error, 'fetching media item');
      return null;
    }
  },
  
  async listByProject(projectId: string): Promise<MediaItem[]> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert to MediaItem format
      return (data || []).map(item => ({
        id: item.id,
        type: validateMediaType(item.media_type),
        url: item.url || '',
        name: item.name,
        duration: item.duration,
        startTime: item.start_time,
        endTime: item.end_time
      }));
    } catch (error) {
      handleError(error, 'listing media items');
      return [];
    }
  },
  
  async create(projectId: string, mediaItem: {
    type: 'video' | 'image' | 'audio';
    name: string;
    url?: string;
    duration?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .insert({
          project_id: projectId,
          media_type: mediaItem.type,
          name: mediaItem.name,
          url: mediaItem.url,
          duration: mediaItem.duration,
          start_time: mediaItem.startTime || 0,
          end_time: mediaItem.endTime
        })
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      handleError(error, 'creating media item');
      throw error;
    }
  },
  
  async update(id: string, updates: {
    name?: string;
    url?: string;
    duration?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('media_items')
        .update({
          name: updates.name,
          url: updates.url,
          duration: updates.duration,
          start_time: updates.startTime,
          end_time: updates.endTime
        })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'updating media item');
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'deleting media item');
    }
  }
};

// Tracks
export const trackService = {
  async find(id: string): Promise<Track | null> {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          type: validateTrackType(data.type)
        };
      }
      return null;
    } catch (error) {
      handleError(error, 'fetching track');
      return null;
    }
  },
  
  async listByProject(projectId: string): Promise<Track[]> {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });
        
      if (error) throw error;
      
      return (data || []).map(track => ({
        ...track,
        type: validateTrackType(track.type)
      }));
    } catch (error) {
      handleError(error, 'listing tracks');
      return [];
    }
  },
  
  async create(track: {
    project_id: string;
    type: 'video' | 'audio';
    label?: string;
    position?: number;
    locked?: boolean;
    visible?: boolean;
  }): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .insert(track)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      handleError(error, 'creating track');
      throw error;
    }
  },
  
  async update(id: string, updates: Partial<Omit<Track, 'id' | 'project_id' | 'created_at' | 'updated_at'>>): Promise<void> {
    try {
      const { error } = await supabase
        .from('tracks')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'updating track');
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'deleting track');
    }
  }
};

// Track Items
export const trackItemService = {
  async find(id: string): Promise<TrackItem | null> {
    try {
      const { data, error } = await supabase
        .from('track_items')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, 'fetching track item');
      return null;
    }
  },
  
  async listByTrack(trackId: string): Promise<TrackItem[]> {
    try {
      const { data, error } = await supabase
        .from('track_items')
        .select('*')
        .eq('track_id', trackId)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, 'listing track items');
      return [];
    }
  },
  
  async create(trackItem: Omit<TrackItem, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('track_items')
        .insert(trackItem)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      handleError(error, 'creating track item');
      throw error;
    }
  },
  
  async update(id: string, updates: Partial<Omit<TrackItem, 'id' | 'track_id' | 'media_item_id' | 'created_at' | 'updated_at'>>): Promise<void> {
    try {
      const { error } = await supabase
        .from('track_items')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'updating track item');
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('track_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'deleting track item');
    }
  }
};

// Keyframes
export const keyframeService = {
  async find(id: string): Promise<Keyframe | null> {
    try {
      const { data, error } = await supabase
        .from('keyframes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          properties: convertJsonToRecord(data.properties)
        };
      }
      return null;
    } catch (error) {
      handleError(error, 'fetching keyframe');
      return null;
    }
  },
  
  async listByTrackItem(trackItemId: string): Promise<Keyframe[]> {
    try {
      const { data, error } = await supabase
        .from('keyframes')
        .select('*')
        .eq('track_item_id', trackItemId)
        .order('timestamp', { ascending: true });
        
      if (error) throw error;
      
      return (data || []).map(keyframe => ({
        ...keyframe,
        properties: convertJsonToRecord(keyframe.properties)
      }));
    } catch (error) {
      handleError(error, 'listing keyframes');
      return [];
    }
  },
  
  async create(keyframe: Omit<Keyframe, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('keyframes')
        .insert(keyframe)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      handleError(error, 'creating keyframe');
      throw error;
    }
  },
  
  async update(id: string, updates: Partial<Omit<Keyframe, 'id' | 'track_item_id' | 'created_at' | 'updated_at'>>): Promise<void> {
    try {
      const { error } = await supabase
        .from('keyframes')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'updating keyframe');
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('keyframes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      handleError(error, 'deleting keyframe');
    }
  }
};

// Define the validateMediaType function used earlier
const validateMediaType = (type: string): 'video' | 'image' | 'audio' => {
  if (type === 'video' || type === 'image' || type === 'audio') {
    return type;
  }
  // Default to 'image' if type is invalid
  console.warn(`Invalid media type: ${type}, defaulting to 'image'`);
  return 'image';
};

// Export all services
export const supabaseService = {
  projects: projectService,
  media: mediaService,
  tracks: trackService,
  trackItems: trackItemService,
  keyframes: keyframeService
};

export default supabaseService;
