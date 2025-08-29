import { WorkflowCard } from "./WorkflowCard";

const workflowData = [
  {
    id: 1,
    name: "News Automation Pipeline",
    status: "Active",
    lastRun: "2024-01-15 14:30",
    nextRun: "2024-01-15 15:00",
    description: "Complete news processing workflow including scraping, verification, categorization, and publishing"
  }
];

export function WorkflowGrid() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Workflow</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflowData.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}