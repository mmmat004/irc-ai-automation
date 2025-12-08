import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Check, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [formatOptions, setFormatOptions] = useState<NewsFormatOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedFormatId, setSelectedFormatId] = useState<string>("");
  const [previousCategoryId, setPreviousCategoryId] = useState<string>("");
  const [previousFormatId, setPreviousFormatId] = useState<string>("");
  const [previousCategoryName, setPreviousCategoryName] = useState<string>("");
  const [previousFormatName, setPreviousFormatName] = useState<string>("");
  // Separate state for previous week's configuration (should not be updated when saving)
  const [previousWeekCategoryId, setPreviousWeekCategoryId] = useState<string>("");
  const [previousWeekFormatId, setPreviousWeekFormatId] = useState<string>("");
  const [previousWeekCategoryName, setPreviousWeekCategoryName] = useState<string>("");
  const [previousWeekFormatName, setPreviousWeekFormatName] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 1 week ago
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    // Load options and current configuration from API
    const loadData = async () => {
      try {
        const [categoriesResponse, formatsResponse, latestInfoResponse] = await Promise.all([
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_CATEGORY, {
            credentials: 'include'
          }),
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_FORMAT, {
            credentials: 'include'
          }),
          fetch(API_ENDPOINTS.WORKFLOW_CONFIG_LATEST_INFO, {
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

        // Load latest configuration info
        if (latestInfoResponse.ok) {
          const latestInfo = await latestInfoResponse.json();
          console.log('Latest workflow config info:', latestInfo);
          
          // Set last updated date
          let updateDate: Date | null = null;
          if (latestInfo.updatedAt || latestInfo.lastUpdated || latestInfo.createdAt) {
            const parsedDate = new Date(latestInfo.updatedAt || latestInfo.lastUpdated || latestInfo.createdAt);
            if (!isNaN(parsedDate.getTime())) {
              updateDate = parsedDate;
              setLastUpdated(parsedDate);
            }
          }
          
          // Determine if this is from a previous week (more than 7 days ago)
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const isFromPreviousWeek = updateDate && updateDate < oneWeekAgo;
          
          // Set current/previous configuration from API
          if (latestInfo.currentCategoryName) {
            setPreviousCategoryName(latestInfo.currentCategoryName);
          }
          if (latestInfo.categoryId || latestInfo.currentCategoryId) {
            setPreviousCategoryId(latestInfo.categoryId || latestInfo.currentCategoryId);
          }
          
          if (latestInfo.currentFormatName) {
            setPreviousFormatName(latestInfo.currentFormatName);
          }
          if (latestInfo.formatId || latestInfo.currentFormatId) {
            setPreviousFormatId(latestInfo.formatId || latestInfo.currentFormatId);
          }
          
          // If the config is from a previous week, also set it as previous week's config
          // Otherwise, we'll need to fetch or calculate the actual previous week's config
          if (isFromPreviousWeek) {
            if (latestInfo.currentCategoryName) {
              setPreviousWeekCategoryName(latestInfo.currentCategoryName);
            }
            if (latestInfo.categoryId || latestInfo.currentCategoryId) {
              setPreviousWeekCategoryId(latestInfo.categoryId || latestInfo.currentCategoryId);
            }
            if (latestInfo.currentFormatName) {
              setPreviousWeekFormatName(latestInfo.currentFormatName);
            }
            if (latestInfo.formatId || latestInfo.currentFormatId) {
              setPreviousWeekFormatId(latestInfo.formatId || latestInfo.currentFormatId);
            }
          } else {
            // If current config is recent, try to get previous week's config from API
            // For now, we'll use the current config as previous week if no separate endpoint exists
            // This is a limitation - ideally the API should provide previous week's config separately
            // Check if API provides previousWeekCategoryName or similar fields
            if (latestInfo.previousWeekCategoryName || latestInfo.previousCategoryName) {
              setPreviousWeekCategoryName(latestInfo.previousWeekCategoryName || latestInfo.previousCategoryName);
            }
            if (latestInfo.previousWeekCategoryId || latestInfo.previousCategoryId) {
              setPreviousWeekCategoryId(latestInfo.previousWeekCategoryId || latestInfo.previousCategoryId);
            }
            if (latestInfo.previousWeekFormatName || latestInfo.previousFormatName) {
              setPreviousWeekFormatName(latestInfo.previousWeekFormatName || latestInfo.previousFormatName);
            }
            if (latestInfo.previousWeekFormatId || latestInfo.previousFormatId) {
              setPreviousWeekFormatId(latestInfo.previousWeekFormatId || latestInfo.previousFormatId);
            }
          }
        } else {
          console.warn(`Latest info endpoint failed: ${latestInfoResponse.status} ${latestInfoResponse.statusText}`);
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
  // Use latest info if available, otherwise use first option
  useEffect(() => {
    if (categoryOptions.length > 0 && selectedCategoryId === "") {
      // Prefer previousCategoryId from API if available, otherwise use first option
      const defaultCategoryId = previousCategoryId || categoryOptions[0].id;
      setSelectedCategoryId(defaultCategoryId);
      if (!previousCategoryId) {
        setPreviousCategoryId(defaultCategoryId);
      }
    }
  }, [categoryOptions, selectedCategoryId, previousCategoryId]);

  useEffect(() => {
    if (formatOptions.length > 0 && selectedFormatId === "") {
      // Prefer previousFormatId from API if available, otherwise use first option
      const defaultFormatId = previousFormatId || formatOptions[0].id;
      setSelectedFormatId(defaultFormatId);
      if (!previousFormatId) {
        setPreviousFormatId(defaultFormatId);
      }
    }
  }, [formatOptions, selectedFormatId, previousFormatId]);

  useEffect(() => {
    // Check if current selection differs from the last saved configuration
    // Compare against previousCategoryId/previousFormatId (the last saved values)
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
      toast.error(t('weeklyConfig.chooseCategory'));
      return;
    }

    if (!selectedFormatId || selectedFormatId === "") {
      toast.error(t('weeklyConfig.chooseFormat'));
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
      
      // Before updating current config, save the current values as previous week's config
      // This ensures we always have the previous week's settings to compare against
      if (previousCategoryId && previousFormatId) {
        // Save current config as previous week's config before updating
        setPreviousWeekCategoryId(previousCategoryId);
        setPreviousWeekFormatId(previousFormatId);
        setPreviousWeekCategoryName(previousCategoryName);
        setPreviousWeekFormatName(previousFormatName);
      }
      
      // Update current configuration with newly saved values
      setPreviousCategoryId(selectedCategoryId);
      setPreviousFormatId(selectedFormatId);
      // Update names from selected options
      const savedCategory = categoryOptions.find(c => c.id === selectedCategoryId);
      const savedFormat = formatOptions.find(f => f.id === selectedFormatId);
      if (savedCategory) {
        setPreviousCategoryName(savedCategory.name);
      }
      if (savedFormat) {
        setPreviousFormatName(savedFormat.name);
      }
      setLastUpdated(new Date());
      setHasChanges(false);
      
      if (onSave) {
        const categoryName = savedCategory?.name || '';
        const formatName = savedFormat?.name || '';
        onSave({
          category: categoryName,
          format: formatName
        });
      }
      
      console.log('✅ Workflow configuration saved successfully');
      toast.success(t('common.success'));
    } catch (error) {
      console.error('❌ Save configuration error:', error);
      
      // Don't show additional error toast if we already showed one above
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('HTTP 500') && !errorMessage.includes('HTTP 401') && !errorMessage.includes('HTTP 403')) {
        toast.error(t('common.error'));
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
                {t('weeklyConfig.title')}
              </CardTitle>
              <CardDescription>
                {t('weeklyConfig.description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <span className="ml-3 text-sm text-muted-foreground">{t('weeklyConfig.loadingOptions')}</span>
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
              {t('weeklyConfig.title')}
            </CardTitle>
            <CardDescription>
              {t('weeklyConfig.description')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            {t('weeklyConfig.lastUpdated')} {formatDate(lastUpdated)}
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
              <h4 className="font-medium">{t('weeklyConfig.summary')}</h4>
              
              {/* Last Saved Category Tag */}
              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  {t('workflows.currentTopic')}
                </label>
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
                >
                  {previousCategoryName || (previousCategoryId ? categoryOptions.find(c => c.id === previousCategoryId)?.name || 'Not set' : 'Not set')}
                </Badge>
              </div>

              {/* Last Saved Format */}
              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  {t('workflows.currentFormat')}
                </label>
                <Badge variant="outline">
                  {previousFormatName || (previousFormatId ? formatOptions.find(f => f.id === previousFormatId)?.name || 'Not set' : 'Not set')}
                </Badge>
              </div>

            </div>

            {/* Previous Configuration Reference */}
            {hasChanges && (
              <div className="space-y-2">
                <label className="text-sm font-medium block text-muted-foreground">
                  Previous Configuration
                </label>
                <div className="flex flex-wrap gap-2">
                  {(previousWeekCategoryId || previousWeekCategoryName) && (
                    <Badge variant="outline" className="text-muted-foreground">
                      {t('workflows.topic')} {previousWeekCategoryName || (previousWeekCategoryId ? categoryOptions.find(c => c.id === previousWeekCategoryId)?.name : '')}
                    </Badge>
                  )}
                  {(previousWeekFormatId || previousWeekFormatName) && (
                    <Badge variant="outline" className="text-muted-foreground">
                      {t('workflows.format')} {previousWeekFormatName || (previousWeekFormatId ? formatOptions.find(f => f.id === previousWeekFormatId)?.name : '')}
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
              ? t('weeklyConfig.unsavedChanges') 
              : t('weeklyConfig.upToDate')
            }
          </div>
          <Button 
            onClick={handleSave}
            disabled={!selectedCategoryId || !selectedFormatId || selectedCategoryId === "" || selectedFormatId === "" || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? t('weeklyConfig.saving') : t('weeklyConfig.saveConfig')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}