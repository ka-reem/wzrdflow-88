
import React, { useState } from 'react';
import BlockBase, { ConnectionPoint } from './BlockBase';
import { Textarea } from '@/components/ui/textarea';

export interface TextBlockProps {
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

const TextBlock: React.FC<TextBlockProps> = ({ 
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
  const [text, setText] = useState<string>("Enter your prompt here...");

  const handleClear = () => {
    setText("");
  };

  return (
    <BlockBase
      id={id}
      type="text"
      title="TEXT"
      onSelect={onSelect}
      isSelected={isSelected}
      generationTime="~2s"
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
          <div className="text-blue-400">Model: GPT-4o</div>
        </div>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[80px] text-sm bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 resize-none"
          placeholder="Enter your prompt here..."
        />
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-white rounded"
          >
            Clear
          </button>
          <button
            className="px-3 py-1 text-xs bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-600 hover:to-purple-600 text-white rounded shadow-glow-purple-sm hover:shadow-glow-purple-md transition-all-std"
          >
            Generate
          </button>
        </div>
      </div>
    </BlockBase>
  );
};

export default TextBlock;
