import { useState } from "react";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DateRange } from "react-day-picker";

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
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    dateRange: "all"
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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
    if (!range) return "All Dates";
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    if (range.from) {
      return formatDate(range.from);
    }
    return "All Dates";
  };

  const hasActiveFilters = filters.search !== "" || filters.category !== "all" || filters.status !== "all" || (filters.dateRange !== "all" && filters.dateRange !== undefined);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search news articles..."
            className="pl-10 bg-white border-gray-300"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <Select value={filters.category} onValueChange={(value: string) => updateFilter("category", value)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Dropdown */}
        <Select value={filters.status} onValueChange={(value: string) => updateFilter("status", value)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Calendar Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white border-gray-300"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange === "all" || !dateRange 
                ? "All Dates" 
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
                  Show All
                </Button>
                {dateRange && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateRangeChange(undefined)}
                    className="text-xs"
                  >
                    Clear
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
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: "{filters.search}"
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter("search", "")}
                />
              </Badge>
            )}
            {filters.category !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {filters.category}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter("category", "all")}
                />
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter("status", "all")}
                />
              </Badge>
            )}
            {filters.dateRange !== "all" && filters.dateRange !== undefined && (
              <Badge variant="secondary" className="gap-1">
                Date: {formatDateRange(dateRange)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setDateRange(undefined);
                    updateFilter("dateRange", "all");
                  }}
                />
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}