import { useState } from "react";
import { NewsHeader } from "../components/NewsHeader";
import { NewsFilters, type FilterState } from "../components/NewsFilters";
import { NewsTable } from "../components/NewsTable";

interface NewsManagementProps {
  onNewsSelect?: (newsId: string | number) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function NewsManagement({ onNewsSelect, currentPage: externalCurrentPage, onPageChange }: NewsManagementProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    dateRange: "all"
  });
  
  // Use external currentPage if provided, otherwise manage internally
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const setCurrentPage = onPageChange || setInternalCurrentPage;

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
        <NewsTable 
          onNewsSelect={onNewsSelect} 
          filters={filters} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}


