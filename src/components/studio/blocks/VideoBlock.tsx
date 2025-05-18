
import React, { useState } from 'react';
import { Upload, Play, Pause } from 'lucide-react';
import BlockBase, { ConnectionPoint } from './BlockBase';

export interface VideoBlockProps {
  id: string;
  onSelect: () => void;
  isSelected: boolean;
  supportsConnections?: boolean;
  connectionPoints?: ConnectionPoint[];
  onStartConnection?: (blockId: string, pointId: string, e: React.MouseEvent) => void;
  onFinishConnection?: (blockId: string, pointId: string) => void;
  onShowHistory?: () => void;
  onDragEnd?: (position: { x: number, y: number }) => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ 
  id, 
  onSelect, 
  isSelected,
  supportsConnections,
  connectionPoints,
  onStartConnection,
  onFinishConnection,
  onShowHistory,
  onDragEnd
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <BlockBase
      id={id}
      type="video"
      title="VIDEO"
      onSelect={onSelect}
      isSelected={isSelected}
      generationTime="~3m"
      supportsConnections={supportsConnections}
      connectionPoints={connectionPoints}
      onShowHistory={onShowHistory}
      onStartConnection={onStartConnection}
      onFinishConnection={onFinishConnection}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <div>Try to...</div>
          <div className="text-amber-400">Model: Pika</div>
        </div>
        
        {!videoUrl ? (
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 flex flex-col items-center justify-center gap-4 min-h-[150px] bg-zinc-800/20">
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs">
                <Upload size={12} />
                Upload video
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs">
                Generate from image
              </button>
            </div>
            
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-amber-500"
              placeholder="Try 'A whimsical animated clip about dreams'"
            />
          </div>
        ) : (
          <div className="relative group">
            <video
              src={videoUrl}
              className="w-full h-auto rounded-lg"
              loop
              autoPlay={isPlaying}
              muted
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </BlockBase>
  );
};

export default VideoBlock;
