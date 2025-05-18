
import { ProjectProvider } from './ProjectContext';
import ProjectSetupHeader from './ProjectSetupHeader';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';
import NavigationFooter from './NavigationFooter';

const ProjectSetupWizard = () => {
  return (
    <ProjectProvider>
      <div className="min-h-screen flex flex-col bg-[#111319]">
        {/* Header */}
        <ProjectSetupHeader />
        
        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        <TabContent />

        {/* Footer with navigation buttons */}
        <NavigationFooter />
      </div>
    </ProjectProvider>
  );
};

export default ProjectSetupWizard;
