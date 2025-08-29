import { Clock, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface Workflow {
  id: number;
  name: string;
  status: string;
  lastRun: string;
  nextRun: string;
  description: string;
}

interface WorkflowCardProps {
  workflow: Workflow;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const handleViewLogs = () => {
    console.log(`Viewing logs for workflow ${workflow.id}`);
  };

  const handleEdit = () => {
    console.log(`Editing workflow ${workflow.id}`);
  };

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-xl hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{workflow.name}</h3>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-lg">
            {workflow.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {workflow.description}
        </p>
      </CardHeader>
      
      <CardContent className="py-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Last run:</span>
            <span className="text-foreground">{workflow.lastRun}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Play className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Next run:</span>
            <span className="text-foreground">{workflow.nextRun}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 gap-2">
        <Button
          onClick={handleViewLogs}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-lg hover:scale-105 transition-transform duration-200"
          size="sm"
        >
          View Logs
        </Button>
        <Button
          onClick={handleEdit}
          variant="outline"
          className="border-border text-foreground hover:bg-muted flex-1 rounded-lg hover:scale-105 transition-all duration-200"
          size="sm"
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}