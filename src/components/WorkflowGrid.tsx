import { useState, useEffect } from "react";
import { WorkflowCard } from "./WorkflowCard";
import { API_ENDPOINTS } from "../config/api";

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
  const [currentConfig, setCurrentConfig] = useState<{
    category?: string;
    format?: string;
  }>({});

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [categoryResponse, formatResponse] = await Promise.all([
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_CATEGORY, {
            credentials: 'include'
          }),
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_FORMAT, {
            credentials: 'include'
          })
        ]);

        const config: { category?: string; format?: string } = {};

        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          config.category = categoryData.category;
        }

        if (formatResponse.ok) {
          const formatData = await formatResponse.json();
          config.format = formatData.format;
        }

        setCurrentConfig(config);
      } catch (error) {
        console.error('Failed to load workflow config:', error);
      }
    };

    loadConfig();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Workflow</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflowData.map((workflow) => (
          <WorkflowCard 
            key={workflow.id} 
            workflow={{
              ...workflow,
              currentConfig
            }} 
          />
        ))}
      </div>
    </div>
  );
}