
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ShotForm from './ShotForm';
import ShotImage from './ShotImage';
import ShotAudio from './ShotAudio';
import { ShotDetails } from '@/types/storyboardTypes';
import { useShotCardState } from './useShotCardState';
import { useAIGeneration } from './useAIGeneration';
import { useAudioGeneration } from './useAudioGeneration';
import { Button } from '@/components/ui/button';
import { Trash2, Move, Expand } from 'lucide-react';

interface ShotCardProps {
  shot: ShotDetails;
  onUpdate: (updates: Partial<ShotDetails>) => Promise<void>;
  onDelete: () => void;
}

export const ShotCard: React.FC<ShotCardProps> = ({ shot, onUpdate, onDelete }) => {
  const {
    // State
    shotType,
    promptIdea,
    dialogue,
    soundEffects,
    localVisualPrompt,
    localImageUrl,
    localImageStatus,
    localAudioUrl,
    localAudioStatus,
    isDeleting,
    isSaving,
    isGeneratingPrompt,
    isGeneratingImage,
    isGeneratingAudio,
    isGeneratingRef,
    
    // Setters
    setShotType,
    setPromptIdea,
    setDialogue,
    setSoundEffects,
    setLocalVisualPrompt,
    setLocalImageStatus,
    setLocalAudioUrl,
    setLocalAudioStatus,
    setIsDeleting,
    setIsGeneratingPrompt,
    setIsGeneratingImage,
    setIsGeneratingAudio,
    
    // Handlers
    handleShotTypeChange
  } = useShotCardState(shot, onUpdate);

  // Create additional state for expanded view and editing mode
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const { handleGenerateVisualPrompt, handleGenerateImage } = useAIGeneration({
    shotId: shot.id,
    isGeneratingRef,
    setIsGeneratingPrompt,
    setIsGeneratingImage,
    setLocalVisualPrompt,
    setLocalImageStatus,
    localVisualPrompt
  });

  const { handleGenerateAudio } = useAudioGeneration({
    shotId: shot.id,
    isGeneratingRef,
    setIsGeneratingAudio,
    setLocalAudioUrl,
    setLocalAudioStatus
  });

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: shot.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Create proper event handlers for text inputs that work with the state setters
  const handlePromptIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptIdea(e.target.value);
  };

  const handleDialogueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDialogue(e.target.value);
  };

  const handleSoundEffectsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSoundEffects(e.target.value);
  };

  // Handlers for edit form
  const handleSave = async () => {
    setIsEditing(false);
    // No Promise is being returned here, which was causing the type error
    // But our updated interface will handle this correctly now
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddShotType = () => {
    setIsEditing(true);
  };

  const validateAndDelete = () => {
    if (window.confirm('Are you sure you want to delete this shot?')) {
      setIsDeleting(true);
      onDelete();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ 
        translateY: -5, 
        rotateX: '3deg', 
        rotateY: '2deg', 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
      style={style}
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col glass-card rounded-lg overflow-hidden w-[230px] min-h-[300px]",
        "transform-style-3d transition-all-std hover:shadow-glow-purple-md",
        isExpanded && "min-h-[400px] w-[320px]"
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 cursor-move bg-black/30 hover:bg-black/50 backdrop-blur-sm p-1 rounded opacity-70 hover:opacity-100 transition-opacity"
      >
        <Move className="h-4 w-4 text-white" />
      </div>
      
      {/* Expand/Collapse button */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: 0 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-20 h-6 w-6 p-1 bg-black/30 hover:bg-black/50 backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Expand className="h-4 w-4 text-white" />
        </Button>
      </motion.div>
      
      {/* Delete button */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: 0 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 z-20 h-6 w-6 p-1 bg-black/30 hover:bg-black/50 backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
          onClick={validateAndDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Shot number badge */}
      <motion.div 
        className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-amber-800/80 backdrop-blur-sm text-amber-100 text-xs px-2 py-0.5 rounded-full"
        whileHover={{ scale: 1.1 }}
      >
        Shot {shot.shot_number}
      </motion.div>

      {/* Image section */}
      <div className="flex-shrink-0">
        <ShotImage
          shotId={shot.id}
          imageUrl={shot.image_url}
          status={localImageStatus}
          isGenerating={isGeneratingPrompt || isGeneratingImage}
          hasVisualPrompt={!!localVisualPrompt}
          onGenerateImage={handleGenerateImage}
          onGenerateVisualPrompt={handleGenerateVisualPrompt}
        />
      </div>

      {/* Shot details */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        {isEditing ? (
          <ShotForm
            id={shot.id}
            shotType={shotType}
            promptIdea={promptIdea}
            dialogue={dialogue}
            soundEffects={soundEffects}
            visualPrompt={localVisualPrompt}
            imageStatus={localImageStatus}
            audioUrl={localAudioUrl}
            audioStatus={localAudioStatus}
            isGeneratingPrompt={isGeneratingPrompt}
            isGeneratingImage={isGeneratingImage}
            isGeneratingAudio={isGeneratingAudio}
            isGeneratingRef={isGeneratingRef}
            onShotTypeChange={handleShotTypeChange}
            onPromptIdeaChange={handlePromptIdeaChange}
            onDialogueChange={handleDialogueChange}
            onSoundEffectsChange={handleSoundEffectsChange}
            setLocalVisualPrompt={setLocalVisualPrompt}
            setLocalImageStatus={setLocalImageStatus}
            setIsGeneratingPrompt={setIsGeneratingPrompt}
            setIsGeneratingImage={setIsGeneratingImage}
            setLocalAudioUrl={setLocalAudioUrl}
            setLocalAudioStatus={setLocalAudioStatus}
            setIsGeneratingAudio={setIsGeneratingAudio}
            onSave={handleSave}
            onCancel={handleCancel}
            isExpanded={isExpanded}
          />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 mb-2">
              {!shotType ? (
                <button 
                  onClick={handleAddShotType}
                  className="text-xs text-zinc-400 hover:text-zinc-300 mb-1 hover:underline"
                >
                  + Add shot type
                </button>
              ) : (
                <div className="text-xs text-purple-300 mb-1">
                  {shotType.replace(/_/g, ' ')}
                </div>
              )}
              
              <div className="text-xs text-zinc-400 line-clamp-3 mb-2">
                {promptIdea || "No description"}
              </div>
              
              {isExpanded && localVisualPrompt && (
                <div className="text-xs text-zinc-500 mt-1 border-t border-white/10 pt-1">
                  <span className="text-zinc-400 font-medium">Visual Prompt:</span>
                  <p className="line-clamp-4">{localVisualPrompt}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col mt-auto">
              {dialogue && (
                <div className="text-xs text-zinc-400 border-t border-white/10 pt-1 mb-1">
                  <span className="text-zinc-300 font-medium">Dialogue:</span>
                  <p className="italic line-clamp-2">{dialogue}</p>
                </div>
              )}
              
              <div className="flex justify-between mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/20 p-1 h-auto"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
              
              {/* Audio generation */}
              <ShotAudio
                audioUrl={shot.audio_url}
                status={shot.audio_status}
                isGenerating={isGeneratingAudio}
                hasDialogue={!!dialogue}
                onGenerateAudio={handleGenerateAudio}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
