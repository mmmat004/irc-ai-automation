import { WorkflowHeader } from "../components/WorkflowHeader";
import { WorkflowGrid } from "../components/WorkflowGrid";
import { RecentExecutions } from "../components/RecentExecutions";
import { WeeklyCategoriesConfig } from "../components/WeeklyCategoriesConfig";

export function WorkflowDashboard() {
  const handleCategorySave = (category: string) => {
    // This would typically update the n8n workflow parameters
    console.log("Category saved for n8n workflow:", category);
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <WorkflowHeader />
        
        {/* Weekly Categories Configuration */}
        <WeeklyCategoriesConfig onSave={handleCategorySave} />
        
        {/* Workflow Cards Grid */}
        <WorkflowGrid />
        
        {/* Recent Executions */}
        <RecentExecutions />
      </div>
    </div>
  );
}