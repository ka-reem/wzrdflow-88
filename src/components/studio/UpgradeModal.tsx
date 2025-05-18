
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  title = "Assets",
  description = "Upgrade to upload and store your own media",
  icon
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-8 h-8"></div> {/* Spacer for alignment */}
          <h2 className="text-xl font-medium text-white text-center">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center py-4">
          {icon ? (
            <div className="mb-4">{icon}</div>
          ) : (
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          )}
          
          <p className="text-zinc-400 text-center mb-6">{description}</p>
          
          <Button className="bg-white hover:bg-zinc-200 text-black px-8">
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
