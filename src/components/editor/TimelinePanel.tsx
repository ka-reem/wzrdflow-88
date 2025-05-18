
import React from 'react';
import { useVideoEditor } from '@/providers/VideoEditorProvider';
import { ScrollArea } from '@/components/ui/scroll-area';

const TimelinePanel = () => {
  const { 
    mediaItems, 
    currentTime, 
    duration,
    selectedMediaIds,
    selectMediaItem,
  } = useVideoEditor();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-none bg-[#0A0D16] border-b border-[#1D2130] p-2 flex items-center justify-between">
        <span className="text-sm font-medium">Timeline</span>
        <div className="text-xs text-zinc-400">
          Current time: {currentTime.toFixed(2)}s
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="min-h-[200px] relative">
          {/* Timeline ruler */}
          <div className="h-6 border-b border-[#1D2130] bg-[#0A0D16] sticky top-0 flex">
            {Array.from({ length: Math.ceil(duration || 10) }).map((_, i) => (
              <div key={i} className="flex-none w-[100px] border-r border-[#1D2130] text-xs text-zinc-500 flex items-center pl-1">
                {i}s
              </div>
            ))}
          </div>
          
          {/* Tracks */}
          <div className="flex flex-col">
            {/* Video track */}
            <div className="h-16 border-b border-[#1D2130] flex items-center relative">
              <div className="w-20 flex-none bg-[#0A0D16] h-full border-r border-[#1D2130] flex items-center justify-center text-xs text-zinc-400">
                Video
              </div>
              
              <div className="flex-1 h-full relative">
                {mediaItems
                  .filter(item => item.type === 'video' || item.type === 'image')
                  .map(item => (
                    <div 
                      key={item.id}
                      className={`absolute h-12 top-2 bg-purple-800 rounded-md border-2 ${
                        selectedMediaIds.includes(item.id) ? 'border-purple-400' : 'border-purple-900'
                      }`}
                      style={{
                        left: `${(item.startTime || 0) * 100}px`,
                        width: `${((item.endTime || item.duration || 5) - (item.startTime || 0)) * 100}px`
                      }}
                      onClick={() => selectMediaItem(item.id)}
                    >
                      <div className="px-2 py-1 truncate text-xs font-medium text-white">
                        {item.name}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Audio track */}
            <div className="h-16 border-b border-[#1D2130] flex items-center relative">
              <div className="w-20 flex-none bg-[#0A0D16] h-full border-r border-[#1D2130] flex items-center justify-center text-xs text-zinc-400">
                Audio
              </div>
              
              <div className="flex-1 h-full relative">
                {mediaItems
                  .filter(item => item.type === 'audio')
                  .map(item => (
                    <div 
                      key={item.id}
                      className={`absolute h-12 top-2 bg-blue-800 rounded-md border-2 ${
                        selectedMediaIds.includes(item.id) ? 'border-blue-400' : 'border-blue-900'
                      }`}
                      style={{
                        left: `${(item.startTime || 0) * 100}px`,
                        width: `${((item.endTime || item.duration || 5) - (item.startTime || 0)) * 100}px`
                      }}
                      onClick={() => selectMediaItem(item.id)}
                    >
                      <div className="px-2 py-1 truncate text-xs font-medium text-white">
                        {item.name}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Empty track for drag and drop */}
            <div className="h-16 border-b border-[#1D2130] flex items-center">
              <div className="w-20 flex-none bg-[#0A0D16] h-full border-r border-[#1D2130]" />
              <div className="flex-1 h-full" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelinePanel;
