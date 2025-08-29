import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Check, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface WeeklyCategoriesConfigProps {
  onSave?: (category: string) => void;
}

const CATEGORY_OPTIONS = [
  "Technology",
  "Business", 
  "Politics",
  "Sports",
  "Health",
  "Science",
  "Finance",
  "Entertainment",
  "World News",
  "Environment"
];

export function WeeklyCategoriesConfig({ onSave }: WeeklyCategoriesConfigProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [previousCategory, setPreviousCategory] = useState<string>("Technology");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 1 week ago
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize with last week's selection
    setSelectedCategory(previousCategory);
  }, [previousCategory]);

  useEffect(() => {
    // Check if current selection differs from previous
    setHasChanges(selectedCategory !== previousCategory);
  }, [selectedCategory, previousCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSave = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category before saving");
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call - replace with actual database save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreviousCategory(selectedCategory);
      setLastUpdated(new Date());
      setHasChanges(false);
      
      if (onSave) {
        onSave(selectedCategory);
      }
      
      toast.success("Category configuration updated successfully");
    } catch (error) {
      toast.error("Failed to save category configuration");
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
        {/* Category Selection */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select News Topic for This Week
            </label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full max-w-xs">
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

          {/* Selected Category Tag */}
          {selectedCategory && (
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Current Week's Topic:
              </label>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                >
                  {selectedCategory}
                </Badge>
                {!hasChanges && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="h-3 w-3" />
                    No changes from previous week
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previous Week Reference */}
          {hasChanges && previousCategory && (
            <div className="space-y-2">
              <label className="text-sm font-medium block text-muted-foreground">
                Previous Week's Topic:
              </label>
              <Badge variant="outline" className="text-muted-foreground">
                {previousCategory}
              </Badge>
            </div>
          )}
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
            disabled={!selectedCategory || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

    
      </CardContent>
    </Card>
  );
}