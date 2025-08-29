import { Check, X, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

const recentExecutions = [
  {
    id: 1,
    workflowName: "News Article Scraper",
    status: "success",
    timestamp: "2024-01-15 14:30:45",
    duration: "2.3s"
  },
  {
    id: 2,
    workflowName: "Content Verification", 
    status: "success",
    timestamp: "2024-01-15 14:25:12",
    duration: "1.8s"
  },
  {
    id: 3,
    workflowName: "Category Classification",
    status: "success",
    timestamp: "2024-01-15 14:20:33",
    duration: "3.1s"
  },
  {
    id: 4,
    workflowName: "Health Monitor",
    status: "success",
    timestamp: "2024-01-15 14:19:55",
    duration: "0.9s"
  },
  {
    id: 5,
    workflowName: "Duplicate Detection",
    status: "error",
    timestamp: "2024-01-15 14:15:22",
    duration: "1.2s"
  },
  {
    id: 6,
    workflowName: "News Article Scraper",
    status: "success",
    timestamp: "2024-01-15 14:00:45",
    duration: "2.1s"
  },
  {
    id: 7,
    workflowName: "Content Verification",
    status: "success", 
    timestamp: "2024-01-15 13:55:18",
    duration: "1.9s"
  },
  {
    id: 8,
    workflowName: "Data Export",
    status: "success",
    timestamp: "2024-01-15 13:00:12",
    duration: "5.4s"
  }
];

export function RecentExecutions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recent Executions</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {recentExecutions.map((execution) => (
          <div key={execution.id} className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {execution.status === 'success' ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{execution.workflowName}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <Badge 
                    className={
                      execution.status === 'success'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }
                  >
                    {execution.status === 'success' ? 'Success' : 'Error'}
                  </Badge>
                  <span className="text-sm text-gray-500">{execution.timestamp}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{execution.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}