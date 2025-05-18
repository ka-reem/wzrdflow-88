
import React, { useState } from 'react';
import { Upload, RefreshCcw, Wand2 } from 'lucide-react';
import BlockBase, { ConnectionPoint } from './BlockBase';

export interface ImageBlockProps {
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

const ImageBlock: React.FC<ImageBlockProps> = ({ 
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  return (
    <BlockBase
      id={id}
      type="image"
      title="IMAGE"
      onSelect={onSelect}
      isSelected={isSelected}
      generationTime="~8s"
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
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="text-emerald-400">Style: Photorealistic</div>
          </div>
        </div>
        
        {!imageUrl ? (
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 flex flex-col items-center justify-center gap-4 min-h-[150px] bg-zinc-800/20">
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs">
                <Upload size={12} />
                Upload image
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs">
                <RefreshCcw size={12} />
                Variations
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs">
                <Wand2 size={12} />
                Generate
              </button>
            </div>
            
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-violet-500"
              placeholder="Try 'A serene lake with mountains at sunset'"
            />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded">
                <Upload size={16} />
              </button>
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded">
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </BlockBase>
  );
};

export default ImageBlock;
