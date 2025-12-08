import { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DateRange } from "react-day-picker";
import { useLanguage } from "../contexts/LanguageContext";
import { API_ENDPOINTS } from "../config/api";

export interface FilterState {
  search: string;
  category: string;
  status: string;
  dateRange: string | DateRange | undefined;
}

interface NewsFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export function NewsFilters({ onFiltersChange }: NewsFiltersProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    dateRange: "all"
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Fetch visible categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CATEGORY_SEARCH + '?keyword=', {
          credentials: 'include'
        });

        if (response.ok) {
          const categoriesData = await response.json();
          const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.items || categoriesData.data || categoriesData.categories || []);
          
          // Filter only visible categories and extract names
          const visibleCategoryNames = categories
            .filter((cat: any) => {
              const isVisible = 
                typeof cat.isVisible === "boolean" ? cat.isVisible :
                typeof cat.isActive === "boolean" ? cat.isActive :
                typeof cat.active === "boolean" ? cat.active :
                cat.status ? String(cat.status).toLowerCase() !== "inactive" :
                true;
              return isVisible;
            })
            .map((cat: any) => cat.name || cat.categoryName || cat.title)
            .filter((name: string) => name); // Remove any empty names
          
          setCategoryOptions(visibleCategoryNames);
        }
      } catch (error) {
        console.error('Error fetching categories for filters:', error);
      }
    };

    fetchCategories();
  }, []);

  const updateFilter = (key: keyof FilterState, value: string | DateRange | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    updateFilter("dateRange", range);
    
    // Close popover when both dates are selected
    if (range?.from && range?.to) {
      setIsDatePopoverOpen(false);
    }
  };

  const handleAllDates = () => {
    setDateRange(undefined);
    updateFilter("dateRange", "all");
  };

  const clearFilters = () => {
    setDateRange(undefined);
    const clearedFilters: FilterState = {
      search: "",
      category: "all",
      status: "all",
      dateRange: "all"
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range) return t('newsFilters.showAll');
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    if (range.from) {
      return formatDate(range.from);
    }
    return t('newsFilters.showAll');
  };

  const hasActiveFilters = filters.search !== "" || filters.category !== "all" || filters.status !== "all" || (filters.dateRange !== "all" && filters.dateRange !== undefined);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('newsFilters.searchPlaceholder')}
            className="pl-10 bg-white border-gray-300"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <Select value={filters.category} onValueChange={(value: string) => updateFilter("category", value)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder={t('newsFilters.allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('newsFilters.allCategories')}</SelectItem>
            {categoryOptions.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Dropdown */}
        <Select value={filters.status} onValueChange={(value: string) => updateFilter("status", value)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder={t('newsFilters.allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('newsFilters.allStatuses')}</SelectItem>
            <SelectItem value="pending">{t('news.pending')}</SelectItem>
            <SelectItem value="verified">{t('news.verified')}</SelectItem>
            <SelectItem value="published">{t('news.published')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Calendar Picker */}
        <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white border-gray-300"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange === "all" || !dateRange 
                ? t('newsFilters.showAll') 
                : formatDateRange(dateRange)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 space-y-3">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
                className="rounded-md border"
              />
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAllDates}
                  className="text-xs"
                >
                  {t('newsFilters.showAll')}
                </Button>
                {dateRange && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateRangeChange(undefined)}
                    className="text-xs"
                  >
                    {t('newsFilters.clear')}
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters and Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{t('newsFilters.activeFilters')}</span>
            {filters.search && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                <span>{t('newsFilters.search')}{filters.search}"</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFilter("search", "");
                  }}
                  className="ml-1 rounded-sm hover:bg-gray-200 p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400"
                  aria-label={t('newsFilters.removeSearch')}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.category !== "all" && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                <span>{t('newsFilters.category')} {filters.category}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFilter("category", "all");
                  }}
                  className="ml-1 rounded-sm hover:bg-gray-200 p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400"
                  aria-label={t('newsFilters.removeCategory')}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                <span>{t('newsFilters.status')} {t(`news.${filters.status}`)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFilter("status", "all");
                  }}
                  className="ml-1 rounded-sm hover:bg-gray-200 p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400"
                  aria-label={t('newsFilters.removeStatus')}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.dateRange !== "all" && filters.dateRange !== undefined && (
              <Badge variant="secondary" className="gap-1.5 pr-1">
                <span>{t('newsFilters.date')} {formatDateRange(dateRange)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateRange(undefined);
                    updateFilter("dateRange", "all");
                  }}
                  className="ml-1 rounded-sm hover:bg-gray-200 p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400"
                  aria-label={t('newsFilters.removeDate')}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            {t('newsFilters.clearAll')}
          </Button>
        </div>
      )}
    </div>
  );
}