import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export function WorkflowHeader() {
  const handleOpenN8nEditor = () => {
    // This would typically open the n8n editor in a new window
    console.log("Opening n8n Editor...");
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">n8n Workflows</h1>
      </div>
      <Button
        onClick={handleOpenN8nEditor}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        Open n8n Editor
      </Button>
    </div>
  );
}