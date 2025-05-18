
import { useState, useRef, useCallback } from 'react';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ConnectionPoint } from './blocks/BlockBase';

interface Block {
  id: string;
  type: 'text' | 'image' | 'video';
  position?: { x: number, y: number };
}

interface Connection {
  id: string;
  sourceBlockId: string;
  sourcePointId: string;
  targetBlockId: string;
  targetPointId: string;
  path?: string;
}

interface StudioCanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

type ViewMode = 'normal' | 'compact' | 'grid';

const StudioCanvas = ({ blocks, selectedBlockId, onSelectBlock }: StudioCanvasProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{blockId: string, pointId: string, x: number, y: number} | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [blockPositions, setBlockPositions] = useState<Record<string, { x: number, y: number }>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Function to get the column span based on view mode
  const getColSpan = (blockType: string, index: number): string => {
    if (viewMode === 'normal') {
      // In normal view, each block takes full width
      return 'col-span-3';
    } else if (viewMode === 'compact') {
      // In compact view, alternate between 2 and 1 columns
      return index % 3 === 0 ? 'col-span-2' : 'col-span-1';
    } else {
      // In grid view, blocks are arranged in a 3-column grid
      return 'col-span-1';
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas background
    if (e.target === e.currentTarget) {
      onSelectBlock('');
    }
  };

  const handleStartConnection = (blockId: string, pointId: string, e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setConnectionStart({ blockId, pointId, x, y });
      setIsDraggingConnection(true);
      setMousePosition({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingConnection && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleFinishConnection = (blockId: string, pointId: string) => {
    if (connectionStart && blockId !== connectionStart.blockId) {
      const newConnection = {
        id: `${connectionStart.blockId}-${connectionStart.pointId}--${blockId}-${pointId}`,
        sourceBlockId: connectionStart.blockId,
        sourcePointId: connectionStart.pointId,
        targetBlockId: blockId,
        targetPointId: pointId
      };
      
      setConnections([...connections, newConnection]);
    }
    
    setIsDraggingConnection(false);
    setConnectionStart(null);
  };

  const handleBlockDragEnd = (blockId: string, position: { x: number, y: number }) => {
    setBlockPositions(prev => ({
      ...prev,
      [blockId]: position
    }));
  };

  // Define connection points for each block type
  const textBlockConnectionPoints: ConnectionPoint[] = [
    { id: 'output', type: 'output', label: 'Text Output', position: 'right' },
    { id: 'input', type: 'input', label: 'Text Input', position: 'left' }
  ];

  const imageBlockConnectionPoints: ConnectionPoint[] = [
    { id: 'image-output', type: 'output', label: 'Image Output', position: 'right' },
    { id: 'prompt-input', type: 'input', label: 'Prompt Input', position: 'left' },
    { id: 'style-input', type: 'input', label: 'Style Input', position: 'top' }
  ];

  const videoBlockConnectionPoints: ConnectionPoint[] = [
    { id: 'video-output', type: 'output', label: 'Video Output', position: 'right' },
    { id: 'image-input', type: 'input', label: 'Image Input', position: 'left' },
    { id: 'prompt-input', type: 'input', label: 'Prompt Input', position: 'top' }
  ];

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-black overflow-auto p-6"
      style={{ 
        backgroundImage: 'radial-gradient(#333 1px, transparent 0)',
        backgroundSize: '24px 24px',
        backgroundPosition: '-12px -12px'
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* Connection lines */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Static connections */}
        {connections.map((conn) => (
          <g key={conn.id}>
            {/* Glow effect */}
            <path 
              d={`M100,100 C150,150 250,250 300,300`} 
              stroke="#9b87f5"
              strokeWidth="10"
              fill="none"
              opacity="0.1"
              filter="blur(3px)"
            />
            {/* Main line */}
            <path 
              d={`M100,100 C150,150 250,250 300,300`} 
              stroke="#9b87f5"
              strokeWidth="3"
              fill="none"
              strokeDasharray="none"
              opacity="0.8"
            />
          </g>
        ))}
        
        {/* Active dragging connection */}
        {isDraggingConnection && connectionStart && (
          <g>
            {/* Glow effect */}
            <path 
              d={`M${connectionStart.x},${connectionStart.y} C${(connectionStart.x + mousePosition.x)/2},${connectionStart.y} ${(connectionStart.x + mousePosition.x)/2},${mousePosition.y} ${mousePosition.x},${mousePosition.y}`} 
              stroke="#9b87f5"
              strokeWidth="10"
              fill="none"
              opacity="0.1"
              filter="blur(3px)"
            />
            {/* Main line */}
            <path 
              d={`M${connectionStart.x},${connectionStart.y} C${(connectionStart.x + mousePosition.x)/2},${connectionStart.y} ${(connectionStart.x + mousePosition.x)/2},${mousePosition.y} ${mousePosition.x},${mousePosition.y}`} 
              stroke="#9b87f5"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              opacity="0.8"
            />
          </g>
        )}
      </svg>

      <div 
        className={cn(
          "max-w-6xl mx-auto py-4 grid grid-cols-3 gap-6",
          viewMode === 'normal' && "grid-cols-1", 
          viewMode === 'compact' && "grid-cols-3",
          viewMode === 'grid' && "grid-cols-3"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {blocks.map((block, index) => {
          const colSpan = getColSpan(block.type, index);
          
          if (block.type === 'text') {
            return (
              <motion.div
                key={block.id}
                className={colSpan}
                layout
                transition={{ duration: 0.3 }}
              >
                <TextBlock 
                  id={block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  isSelected={selectedBlockId === block.id}
                  supportsConnections={true}
                  connectionPoints={textBlockConnectionPoints}
                  onStartConnection={handleStartConnection}
                  onFinishConnection={handleFinishConnection}
                  onDragEnd={(position) => handleBlockDragEnd(block.id, position)}
                />
              </motion.div>
            );
          } else if (block.type === 'image') {
            return (
              <motion.div
                key={block.id}
                className={colSpan}
                layout
                transition={{ duration: 0.3 }}
              >
                <ImageBlock 
                  id={block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  isSelected={selectedBlockId === block.id}
                  supportsConnections={true}
                  connectionPoints={imageBlockConnectionPoints}
                  onStartConnection={handleStartConnection}
                  onFinishConnection={handleFinishConnection}
                  onDragEnd={(position) => handleBlockDragEnd(block.id, position)}
                />
              </motion.div>
            );
          } else if (block.type === 'video') {
            return (
              <motion.div
                key={block.id}
                className={colSpan}
                layout
                transition={{ duration: 0.3 }}
              >
                <VideoBlock 
                  id={block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  isSelected={selectedBlockId === block.id}
                  supportsConnections={true}
                  connectionPoints={videoBlockConnectionPoints}
                  onStartConnection={handleStartConnection}
                  onFinishConnection={handleFinishConnection}
                  onDragEnd={(position) => handleBlockDragEnd(block.id, position)}
                />
              </motion.div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default StudioCanvas;
