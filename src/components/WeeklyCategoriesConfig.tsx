import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Check, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api";

interface WeeklyCategoriesConfigProps {
  onSave?: (config: { category: string; format: string }) => void;
}

// Database response format
interface CategoryOption {
  id: string;
  name: string;
}

interface NewsFormatOption {
  id: string;
  name: string;
  description: string;
}

export function WeeklyCategoriesConfig({ onSave }: WeeklyCategoriesConfigProps) {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [formatOptions, setFormatOptions] = useState<NewsFormatOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedFormatId, setSelectedFormatId] = useState<string>("");
  const [previousCategoryId, setPreviousCategoryId] = useState<string>("");
  const [previousFormatId, setPreviousFormatId] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 1 week ago
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    // Load options and current configuration from API
    const loadData = async () => {
      try {
        const [categoriesResponse, formatsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_CATEGORY, {
            credentials: 'include'
          }),
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_FORMAT, {
            credentials: 'include'
          })
        ]);

        // Load category options
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          
          if (Array.isArray(categoriesData)) {
            setCategoryOptions(categoriesData);
            console.log(`Loaded ${categoriesData.length} categories from API`);
          } else {
            console.warn('Categories response is not an array:', categoriesData);
          }
        } else {
          console.error(`Categories endpoint failed: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
        }

        // Load format options
        if (formatsResponse.ok) {
          const formatsData = await formatsResponse.json();
          
          if (Array.isArray(formatsData)) {
            setFormatOptions(formatsData);
            console.log(`Loaded ${formatsData.length} news formats from API`);
          } else {
            console.warn('Formats response is not an array:', formatsData);
          }
        } else {
          console.error(`Formats endpoint failed: ${formatsResponse.status} ${formatsResponse.statusText}`);
        }


      } catch (error) {
        console.error('Failed to load workflow configuration data:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadData();
  }, []);

  // Set default selections when options are loaded
  useEffect(() => {
    if (categoryOptions.length > 0 && selectedCategoryId === "") {
      setSelectedCategoryId(categoryOptions[0].id);
      setPreviousCategoryId(categoryOptions[0].id);
    }
  }, [categoryOptions, selectedCategoryId]);

  useEffect(() => {
    if (formatOptions.length > 0 && selectedFormatId === "") {
      setSelectedFormatId(formatOptions[0].id);
      setPreviousFormatId(formatOptions[0].id);
    }
  }, [formatOptions, selectedFormatId]);

  useEffect(() => {
    // Check if current selection differs from previous
    setHasChanges(
      selectedCategoryId !== previousCategoryId || 
      selectedFormatId !== previousFormatId
    );
  }, [selectedCategoryId, previousCategoryId, selectedFormatId, previousFormatId]);

  const handleCategoryChange = (value: string) => {
    const categoryName = categoryOptions.find(c => c.id === value)?.name || 'Unknown';
    console.log(`📝 Category selected: ${categoryName} (ID: ${value})`);
    setSelectedCategoryId(value);
  };

  const handleFormatChange = (value: string) => {
    const formatName = formatOptions.find(f => f.id === value)?.name || 'Unknown';
    console.log(`📝 Format selected: ${formatName} (ID: ${value})`);
    setSelectedFormatId(value);
  };

  const handleSave = async () => {
    if (!selectedCategoryId || selectedCategoryId === "") {
      toast.error("Please select a category before saving");
      return;
    }

    if (!selectedFormatId || selectedFormatId === "") {
      toast.error("Please select a news format before saving");
      return;
    }

    setIsSaving(true);
    
    try {
      const categoryName = categoryOptions.find(c => c.id === selectedCategoryId)?.name || 'Unknown';
      const formatName = formatOptions.find(f => f.id === selectedFormatId)?.name || 'Unknown';
      
      console.log(`💾 Saving workflow configuration: ${categoryName} + ${formatName}`);
      
      const requestBody = {
        categoryId: selectedCategoryId,
        formatId: selectedFormatId
      };
      
      // Try main endpoint first
      let response = await fetch(API_ENDPOINTS.WORKFLOW_CONFIG_SAVE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      // If 500 error, try alternative endpoints
      if (response.status === 500) {
        console.warn('⚠️ Main endpoint failed with 500, trying alternatives...');
        
        const alternativeEndpoints = [
          `${API_BASE_URL}/api/workflow-config/save`,
          `${API_BASE_URL}/workflow/save-config`
        ];
        
        for (const endpoint of alternativeEndpoints) {
          console.log(`🔄 Trying alternative endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
          });
          
          if (response.ok) {
            console.log(`✅ Alternative endpoint succeeded: ${endpoint}`);
            break;
          }
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Save failed (${response.status}):`, errorText);
        
        // Handle different error types
        if (response.status === 500) {
          toast.error("Server error occurred. The workflow configuration endpoint may not be implemented yet. Please contact support.");
        } else if (response.status === 401) {
          toast.error("Authentication required. Please log in again.");
        } else if (response.status === 403) {
          toast.error("You don't have permission to perform this action.");
        } else if (response.status === 404) {
          toast.error("Workflow configuration endpoint not found. Please contact support.");
        } else {
          toast.error(`Failed to save configuration: ${response.statusText}`);
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      setPreviousCategoryId(selectedCategoryId);
      setPreviousFormatId(selectedFormatId);
      setLastUpdated(new Date());
      setHasChanges(false);
      
      if (onSave) {
        const selectedCategory = categoryOptions.find(c => c.id === selectedCategoryId)?.name || '';
        const selectedFormat = formatOptions.find(f => f.id === selectedFormatId)?.name || '';
        onSave({
          category: selectedCategory,
          format: selectedFormat
        });
      }
      
      console.log('✅ Workflow configuration saved successfully');
      toast.success("Weekly configuration updated successfully");
    } catch (error) {
      console.error('❌ Save configuration error:', error);
      
      // Don't show additional error toast if we already showed one above
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('HTTP 500') && !errorMessage.includes('HTTP 401') && !errorMessage.includes('HTTP 403')) {
        toast.error("Failed to save configuration. Please try again.");
      }
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

  /// const getCurrentWeekLabel = () => {
    /// const now = new Date();
    /// const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    /// return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  /// };




  if (isLoadingOptions) {
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
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <span className="ml-3 text-sm text-muted-foreground">Loading options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            Last updated: {formatDate(lastUpdated)}
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
                <Select 
                  value={selectedCategoryId} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.length > 0 ? (
                      categoryOptions.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-options" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* News Format Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Select News Format
                </label>
                <Select 
                  value={selectedFormatId} 
                  onValueChange={handleFormatChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a news format..." />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.length > 0 ? (
                      formatOptions.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          <div className="flex flex-col text-left">
                            <span>{format.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {format.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-options" disabled>
                        No formats available
                      </SelectItem>
                    )}
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
              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  Topic:
                </label>
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                >
                  {categoryOptions.find(c => c.id === selectedCategoryId)?.name}
                </Badge>
              </div>

              {/* Selected Format */}
              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  Format:
                </label>
                <Badge variant="outline">
                  {formatOptions.find(f => f.id === selectedFormatId)?.name}
                </Badge>
              </div>

              {!hasChanges && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                  <Check className="h-3 w-3" />
                  Configuration matches previous week
                </div>
              )}
            </div>

            {/* Previous Week Reference */}
            {hasChanges && (
              <div className="space-y-2">
                <label className="text-sm font-medium block text-muted-foreground">
                  Previous Week's Configuration:
                </label>
                <div className="flex flex-wrap gap-2">
                  {previousCategoryId && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Topic: {categoryOptions.find(c => c.id === previousCategoryId)?.name}
                    </Badge>
                  )}
                  {previousFormatId && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Format: {formatOptions.find(f => f.id === previousFormatId)?.name}
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
            disabled={!selectedCategoryId || !selectedFormatId || selectedCategoryId === "" || selectedFormatId === "" || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}