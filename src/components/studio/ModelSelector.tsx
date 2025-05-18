
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Model {
  id: string;
  name: string;
  icon?: React.ReactNode;
  credits?: number;
  time?: string;
  description?: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  modelType: 'text' | 'image' | 'video';
  isOpen: boolean;
  toggleOpen: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onModelSelect,
  modelType,
  isOpen,
  toggleOpen
}) => {
  const selectedModel = models.find(model => model.id === selectedModelId);

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-md"
        onClick={toggleOpen}
      >
        <span className="text-zinc-300">{selectedModel?.name || 'Select Model'}</span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
          {models.map((model) => (
            <button
              key={model.id}
              className={cn(
                "w-full flex items-center p-3 hover:bg-zinc-800 text-left border-b border-zinc-800/50 last:border-0",
                selectedModelId === model.id && "bg-zinc-800/70"
              )}
              onClick={() => {
                onModelSelect(model.id);
                toggleOpen();
              }}
            >
              <div className="mr-3">
                {model.icon ? model.icon : (
                  <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white">
                    {model.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm">{model.name}</div>
                {model.description && (
                  <div className="text-zinc-500 text-xs">{model.description}</div>
                )}
              </div>
              <div className="flex items-center">
                {model.credits && (
                  <span className="text-xs text-zinc-400 mr-2">
                    <span className="text-yellow-500 font-semibold">{model.credits}</span>
                  </span>
                )}
                {model.time && (
                  <span className="text-xs text-zinc-400">{model.time}</span>
                )}
                {selectedModelId === model.id && (
                  <Check className="ml-2 h-4 w-4 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
