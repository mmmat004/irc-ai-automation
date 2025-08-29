import { useState } from "react";
import { Search, Calendar, X } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface FilterState {
  search: string;
  category: string;
  status: string;
  dateRange: string;
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

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearFilters = () => {
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

  const hasActiveFilters = filters.search !== "" || filters.category !== "all" || filters.status !== "all" || filters.dateRange !== "all";
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
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Politics">Politics</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Environment">Environment</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
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

        {/* Date Range Dropdown */}
        <Select value={filters.dateRange} onValueChange={(value: string) => updateFilter("dateRange", value)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="All Dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
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
            {filters.dateRange !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Date: {filters.dateRange}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter("dateRange", "all")}
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