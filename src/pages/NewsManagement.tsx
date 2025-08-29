import { useState } from "react";
import { NewsHeader } from "../components/NewsHeader";
import { NewsFilters, FilterState } from "../components/NewsFilters";
import { NewsTable } from "../components/NewsTable";

interface NewsManagementProps {
  onNewsSelect?: (newsId: number) => void;
}

export function NewsManagement({ onNewsSelect }: NewsManagementProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    dateRange: "all"
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <NewsHeader />
        
        {/* Filters */}
        <div className="mb-6">
          <NewsFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Data Table */}
        <NewsTable onNewsSelect={onNewsSelect} filters={filters} />
      </div>
    </div>
  );
}