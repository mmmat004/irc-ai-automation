import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Check, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

interface WeeklyCategoriesConfigProps {
  onSave?: (config: { category: string; format: string }) => void;
}

const CATEGORY_OPTIONS = [
  "Business",
  "Data",
  "AI", 
  "Technology",
  "Startup",
  "Marketing",
  "Digital Transform",
  "Economic",
  "Finance"
];

const NEWS_FORMAT_OPTIONS = [
  {
    value: "news-report",
    label: "News Report / Article",
    description: "A straightforward, fact-based report of the event"
  },
  {
    value: "analysis",
    label: "Analysis", 
    description: "Deeper breakdown explaining causes, implications, and context"
  },
  {
    value: "opinion",
    label: "Opinion / Editorial",
    description: "Personal viewpoints, arguments, or commentary"
  },
  {
    value: "interview",
    label: "Interview",
    description: "Q&A format with key people involved"
  },
  {
    value: "feature",
    label: "Feature / In-depth Story",
    description: "Long-form, human-focused angle with background"
  },
  {
    value: "review",
    label: "Review / Critique", 
    description: "Evaluation of the event, policy, or media piece"
  },
  {
    value: "live-coverage",
    label: "Live Coverage / Updates",
    description: "Real-time or continuous updates on breaking news"
  },
  {
    value: "transcript",
    label: "Transcript / Statement",
    description: "Direct words from a source (like government release)"
  }
];

export function WeeklyCategoriesConfig({ onSave }: WeeklyCategoriesConfigProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [previousCategory, setPreviousCategory] = useState<string>("Technology");
  const [previousFormat, setPreviousFormat] = useState<string>("news-report");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 1 week ago
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize with last week's selection
    setSelectedCategory(previousCategory);
    setSelectedFormat(previousFormat);
  }, [previousCategory, previousFormat]);

  useEffect(() => {
    // Check if current selection differs from previous
    setHasChanges(
      selectedCategory !== previousCategory || 
      selectedFormat !== previousFormat
    );
  }, [selectedCategory, previousCategory, selectedFormat, previousFormat]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleFormatChange = (value: string) => {
    setSelectedFormat(value);
  };

  const handleSave = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category before saving");
      return;
    }

    if (!selectedFormat) {
      toast.error("Please select a news format before saving");
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call - replace with actual database save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreviousCategory(selectedCategory);
      setPreviousFormat(selectedFormat);
      setLastUpdated(new Date());
      setHasChanges(false);
      
      if (onSave) {
        onSave({
          category: selectedCategory,
          format: selectedFormat
        });
      }
      
      toast.success("Weekly configuration updated successfully");
    } catch (error) {
      toast.error("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentWeekLabel = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };



  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Categories Configuration
            </CardTitle>
            <CardDescription>
              Configure the news topic for automated AI workflow collection
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {getCurrentWeekLabel()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              Last updated: {formatDate(lastUpdated)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Category and Format */}
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select News Topic for This Week
                </label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* News Format Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Select News Format
                </label>
                <Select value={selectedFormat} onValueChange={handleFormatChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a news format..." />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_FORMAT_OPTIONS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex flex-col text-left">
                          <span>{format.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {format.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Configuration Summary</h4>
              
              {/* Selected Category Tag */}
              {selectedCategory && (
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Topic:
                  </label>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                  >
                    {selectedCategory}
                  </Badge>
                </div>
              )}

              {/* Selected Format */}
              {selectedFormat && (
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Format:
                  </label>
                  <Badge variant="outline">
                    {NEWS_FORMAT_OPTIONS.find(f => f.value === selectedFormat)?.label}
                  </Badge>
                </div>
              )}

              {!hasChanges && selectedCategory && selectedFormat && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                  <Check className="h-3 w-3" />
                  Configuration matches previous week
                </div>
              )}
            </div>

            {/* Previous Week Reference */}
            {hasChanges && (previousCategory || previousFormat) && (
              <div className="space-y-2">
                <label className="text-sm font-medium block text-muted-foreground">
                  Previous Week's Configuration:
                </label>
                <div className="flex flex-wrap gap-2">
                  {previousCategory && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Topic: {previousCategory}
                    </Badge>
                  )}
                  {previousFormat && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Format: {NEWS_FORMAT_OPTIONS.find(f => f.value === previousFormat)?.label}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {hasChanges 
              ? "You have unsaved changes" 
              : "Configuration is up to date"
            }
          </div>
          <Button 
            onClick={handleSave}
            disabled={!selectedCategory || !selectedFormat || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}