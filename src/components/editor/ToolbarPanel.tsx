
import React, { useState } from 'react';
import { useVideoEditor } from '@/providers/VideoEditorProvider';
import { Button } from '@/components/ui/button';
import { Settings, Save, Upload, FileText, Scissors, Copy, Undo, Redo, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ToolbarPanel = () => {
  const { 
    projectId,
    projectName, 
    setProjectName,
    openDialog,
    mediaItems
  } = useVideoEditor();
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Function to save project name
  const handleSaveProject = async () => {
    if (!projectId) {
      toast.error("No project to save");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Update project in database
      const { error } = await supabase
        .from('projects')
        .update({ title: projectName })
        .eq('id', projectId);
        
      if (error) throw error;
      
      toast.success("Project saved successfully");
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to create a new project
  const handleCreateProject = async () => {
    try {
      setIsCreatingProject(true);
      
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to create a project");
        return;
      }
      
      // Call the create-project edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: newProjectName || 'Untitled Project',
          description: newProjectDescription,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }
      
      const { project } = await response.json();
      
      // Navigate to the new project (or reload)
      window.location.href = `/editor/${project.id}`;
      
      toast.success("Project created successfully");
      setIsNewProjectDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("Failed to create project");
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <div className="flex-none bg-[#0A0D16] border-b border-[#1D2130] p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* Project name */}
        <div className="flex items-center mr-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none text-sm font-medium"
          />
        </div>
        
        {/* File operations */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-[#1D2130] h-8"
          onClick={handleSaveProject}
          disabled={isSaving || !projectId}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#1D2130] h-8">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new video editing project
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Untitled Project"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description (optional)</Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Project description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsNewProjectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={isCreatingProject}
              >
                {isCreatingProject ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-[#1D2130] h-8"
          onClick={() => openDialog('export')}
          disabled={mediaItems.length === 0}
        >
          <FileText className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Edit operations */}
        <Button variant="ghost" size="sm" className="text-white hover:bg-[#1D2130] h-8 px-2">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-[#1D2130] h-8 px-2">
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-[#1D2130] h-8">
          <Scissors className="h-4 w-4 mr-2" />
          Cut
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-[#1D2130] h-8">
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        
        {/* Settings */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-[#1D2130] h-8"
          onClick={() => openDialog('projectSettings')}
          disabled={!projectId}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ToolbarPanel;
