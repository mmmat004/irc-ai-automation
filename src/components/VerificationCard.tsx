import { useState } from "react";
import { ChevronDown, ChevronUp, Check, X, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  preview: string;
  sources: string[];
  content: string;
}

interface VerificationCardProps {
  newsItem: NewsItem;
  onNewsSelect?: (newsId: number) => void;
  onApprove?: (newsId: number, notes: string) => void;
  onReject?: (newsId: number, notes: string) => void;
}

export function VerificationCard({ newsItem, onNewsSelect, onApprove, onReject }: VerificationCardProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleApprove = () => {
    if (onApprove) {
      onApprove(newsItem.id, adminNotes);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(newsItem.id, adminNotes);
    }
  };

  const handleViewDetails = () => {
    if (onNewsSelect) {
      onNewsSelect(newsItem.id);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border border-l-4 border-l-primary overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 
              className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer"
              onClick={handleViewDetails}
            >
              {newsItem.title}
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
                {newsItem.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {newsItem.date} at {newsItem.time}
              </span>
            </div>
          </div>
          {onNewsSelect && (
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
              className="ml-4 gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          )}
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">
            {newsItem.content}
          </p>
        </div>

        {/* Expandable Sources Section */}
        <Collapsible open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between mb-4 border-border hover:bg-muted rounded-lg"
            >
              <span className="font-medium">Sources ({newsItem.sources.length})</span>
              {isSourcesOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-4">
            <div className="bg-muted rounded-xl p-4">
              <ul className="space-y-2">
                {newsItem.sources.map((source, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Admin Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Admin Notes
          </label>
          <Textarea
            placeholder="Add your verification notes here..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="min-h-[80px] resize-none border-border rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 rounded-lg hover:scale-105 transition-transform duration-200"
          >
            <Check className="w-4 h-4" />
            Approve
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2 flex-1 rounded-lg hover:scale-105 transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}