
import React from 'react';
import { Loader2, Wand2, Play, ImageOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ImageStatus } from '@/types/storyboardTypes';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ShotImageProps {
  shotId: string;
  imageUrl: string | null;
  status: ImageStatus;
  isGenerating: boolean;
  hasVisualPrompt: boolean;
  onGenerateImage: () => void;
  onGenerateVisualPrompt: () => void;
}

const ShotImage: React.FC<ShotImageProps> = ({
  shotId,
  imageUrl,
  status,
  isGenerating,
  hasVisualPrompt,
  onGenerateImage,
  onGenerateVisualPrompt
}) => {
  const [isGeneratingVideo, setIsGeneratingVideo] = React.useState(false);

  const handleGenerateVideo = async () => {
    if (!imageUrl) {
      toast.error('No image available to generate video from');
      return;
    }

    setIsGeneratingVideo(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-video-from-image', {
        body: { shot_id: shotId, image_url: imageUrl }
      });

      if (error) {
        throw new Error(error.message || 'Failed to start video generation');
      }

      toast.success('Video generation started successfully');
    } catch (error: any) {
      console.error('Error generating video:', error);
      toast.error(`Failed to generate video: ${error.message}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const overlayBaseClass = "absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent";
  const textClass = "text-xs text-zinc-400";
  const buttonClass = "text-xs h-7 px-2 bg-black/40 border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm transition-all-std";
  const iconClass = "w-3 h-3 mr-1";

  // Completed Image State
  if (imageUrl && status === 'completed') {
    return (
      <div className="w-full aspect-video relative group/image overflow-hidden">
        <motion.img 
          src={imageUrl} 
          alt="Shot visualization" 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className={cn(overlayBaseClass, "opacity-0 group-hover/image:opacity-100 transition-all duration-200")}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <Button
            variant="outline"
            size="sm"
            className={buttonClass}
            onClick={handleGenerateVideo}
            disabled={isGeneratingVideo}
          >
            {isGeneratingVideo ? (
              <Loader2 className={cn(iconClass, "animate-spin")} />
            ) : (
              <Play className={cn(iconClass, "fill-current")} />
            )}
            Generate Video
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading/Generating/Pending/Failed States
  return (
    <div className="w-full aspect-video bg-zinc-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-2 relative overflow-hidden border-b border-white/5">
      {isGenerating || status === 'generating' ? (
        <motion.div 
          className="flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-400 mb-1" />
          <span className="text-xs text-zinc-300">Generating image...</span>
        </motion.div>
      ) : status === 'failed' ? (
        <motion.div 
          className="flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="h-5 w-5 text-red-400 mb-1" />
          <span className="text-xs text-red-400 mb-2">Generation failed</span>
          <Button 
            variant="outline" 
            size="sm" 
            className={buttonClass}
            onClick={hasVisualPrompt ? onGenerateImage : onGenerateVisualPrompt}
          >
            <RefreshCw className={iconClass} /> Retry
          </Button>
        </motion.div>
      ) : status === 'prompt_ready' ? (
        <motion.div 
          className="flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className={textClass}>Prompt ready</span>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(buttonClass, "text-purple-300 border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-200 mt-2")}
            onClick={onGenerateImage}
          >
            <Wand2 className={iconClass}/> Generate Image
          </Button>
        </motion.div>
      ) : ( // Status is 'pending'
        <motion.div 
          className="flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ImageOff className="h-5 w-5 text-zinc-500 mb-1" />
          <span className={textClass}>No image yet</span>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(buttonClass, "text-blue-300 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-200 mt-2")}
            onClick={onGenerateVisualPrompt}
          >
            <Wand2 className={iconClass} /> Generate Prompt
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ShotImage;
