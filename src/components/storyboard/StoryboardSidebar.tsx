
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, FileCode, Shirt, Mic, Music, Play, Trash2, ChevronDown } from 'lucide-react';
import { SidebarData } from '@/types/storyboardTypes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StoryboardSidebarProps {
  data: SidebarData;
  onUpdate: (updates: {
    description?: string | null;
    location?: string | null;
    lighting?: string | null;
    weather?: string | null;
  }) => void;
}

const StoryboardSidebar: React.FC<StoryboardSidebarProps> = ({ data, onUpdate }) => {
  // Local state to manage input values, initialized from props
  const [locationDesc, setLocationDesc] = useState(data.sceneLocation || '');
  const [lightingDesc, setLightingDesc] = useState(data.sceneLighting || '');
  const [weatherDesc, setWeatherDesc] = useState(data.sceneWeather || '');
  const [sceneDesc, setSceneDesc] = useState(data.sceneDescription || '');

  // Update local state if the selected scene changes (data prop changes)
  useEffect(() => {
    setLocationDesc(data.sceneLocation || '');
    setLightingDesc(data.sceneLighting || '');
    setWeatherDesc(data.sceneWeather || '');
    setSceneDesc(data.sceneDescription || '');
  }, [data.sceneLocation, data.sceneLighting, data.sceneWeather, data.sceneDescription]);

  // Handle updates to scene data
  const handleUpdate = (field: keyof Parameters<typeof onUpdate>[0], value: string | null) => {
    onUpdate({ [field]: value });
  };

  // State for collapsible sections
  const [openSections, setOpenSections] = React.useState({
    location: true,
    style: true,
    clothing: false,
    sound: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Animation variants for collapsible content
  const contentVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    collapsed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const inputBaseClass = "glass-input rounded text-xs h-7 transition-all-fast placeholder:text-zinc-500";
  const labelBaseClass = "text-[10px] font-medium uppercase text-zinc-400 mb-1 block";

  return (
    <div className="w-full glass-panel border-r text-white h-full">
      <ScrollArea className="h-full">
        <div className="p-5 space-y-5">
          {/* Project Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold text-[#2F7BBC] mb-1 font-serif tracking-wide glow-text-blue">
              {data.projectTitle || 'Project Title'}
            </h2>
            <p className="text-zinc-400 text-xs mb-5 leading-relaxed line-clamp-3">
              {data.projectDescription || 'No project description.'}
            </p>
          </motion.div>

          {/* Scene Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label htmlFor="scene-desc" className={labelBaseClass}>Scene Description</label>
            <Textarea
              id="scene-desc"
              value={sceneDesc}
              onChange={(e) => setSceneDesc(e.target.value)}
              onBlur={() => handleUpdate('description', sceneDesc)}
              placeholder="Describe the scene..."
              className={cn(inputBaseClass, "min-h-[80px]")}
            />
          </motion.div>

          {/* Location Section */}
          <Collapsible
            open={openSections.location}
            onOpenChange={() => toggleSection('location')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                className="flex items-center justify-between cursor-pointer hover:text-blue-400 transition-colors py-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <h3 className="text-zinc-200 font-medium text-xs uppercase tracking-wider">Location</h3>
                </div>
                <motion.div
                  animate={{ rotate: openSections.location ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openSections.location && (
                <CollapsibleContent forceMount>
                  <motion.div 
                    variants={contentVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="space-y-2 sidebar-content-glow pl-5"
                  >
                    <div>
                      <label htmlFor="location-desc" className={labelBaseClass}>Description</label>
                      <Input
                        id="location-desc"
                        value={locationDesc}
                        onChange={(e) => setLocationDesc(e.target.value)}
                        onBlur={() => handleUpdate('location', locationDesc)}
                        placeholder="Describe the location..."
                        className={inputBaseClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="lighting-desc" className={labelBaseClass}>Lighting</label>
                      <Input
                        id="lighting-desc"
                        value={lightingDesc}
                        onChange={(e) => setLightingDesc(e.target.value)}
                        onBlur={() => handleUpdate('lighting', lightingDesc)}
                        placeholder="Describe the lighting..."
                        className={inputBaseClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="weather-desc" className={labelBaseClass}>Weather</label>
                      <Input
                        id="weather-desc"
                        value={weatherDesc}
                        onChange={(e) => setWeatherDesc(e.target.value)}
                        onBlur={() => handleUpdate('weather', weatherDesc)}
                        placeholder="Describe the weather..."
                        className={inputBaseClass}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>

          {/* Style Section */}
          <Collapsible
            open={openSections.style}
            onOpenChange={() => toggleSection('style')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                className="flex items-center justify-between cursor-pointer hover:text-blue-400 transition-colors py-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                  <h3 className="text-zinc-200 font-medium text-xs uppercase tracking-wider">Style</h3>
                </div>
                <motion.div
                  animate={{ rotate: openSections.style ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openSections.style && (
                <CollapsibleContent forceMount>
                  <motion.div 
                    variants={contentVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="sidebar-content-glow pl-5"
                  >
                    <div>
                      <label className={labelBaseClass}>Video Style</label>
                      <p className="text-xs text-zinc-300 capitalize">{data.videoStyle || 'Not Set'}</p>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>

          {/* Clothing Section */}
          <Collapsible
            open={openSections.clothing}
            onOpenChange={() => toggleSection('clothing')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                className="flex items-center justify-between cursor-pointer hover:text-blue-400 transition-colors py-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Shirt className="w-3.5 h-3.5 text-zinc-500" />
                  <h3 className="text-zinc-200 font-medium text-xs uppercase tracking-wider">Clothing</h3>
                </div>
                <motion.div
                  animate={{ rotate: openSections.clothing ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openSections.clothing && (
                <CollapsibleContent forceMount>
                  <motion.div 
                    variants={contentVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="sidebar-content-glow pl-5"
                  >
                    <div className="bg-black/30 backdrop-blur-sm p-3 rounded-md border border-white/10">
                      <p className="text-zinc-400 text-xs mb-2">No clothing items specified for this scene yet.</p>
                      <Button variant="outline" size="sm" className="w-full mt-1 border-dashed border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-300 h-7 text-xs">
                        + Add Clothing Item
                      </Button>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>

          {/* Sound Section */}
          <Collapsible
            open={openSections.sound}
            onOpenChange={() => toggleSection('sound')}
            className="pt-3 border-t border-white/5"
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                className="flex items-center justify-between cursor-pointer hover:text-blue-400 transition-colors py-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-zinc-500" />
                  <h3 className="text-zinc-200 font-medium text-xs uppercase tracking-wider">Sound</h3>
                </div>
                <motion.div
                  animate={{ rotate: openSections.sound ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
              </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openSections.sound && (
                <CollapsibleContent forceMount>
                  <motion.div 
                    variants={contentVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="space-y-3 sidebar-content-glow pl-5"
                  >
                    {/* Voiceover Sub-section */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mic className="w-3.5 h-3.5 text-zinc-500" />
                        <p className="text-zinc-300 font-medium text-[10px] uppercase">Voiceover</p>
                      </div>
                      <div className="glass-input rounded-md p-2 flex items-center justify-between">
                        <div className="text-xs text-zinc-400">No voiceover specified.</div>
                      </div>
                    </div>
                    {/* Scene Sound Sub-section */}
                    <div>
                      <label className={labelBaseClass}>Scene Sound Effects</label>
                      <Input
                        placeholder='E.g., "Footsteps on gravel, distant siren..."'
                        className={inputBaseClass}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StoryboardSidebar;
