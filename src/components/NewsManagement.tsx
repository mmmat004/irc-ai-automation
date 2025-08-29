import { NewsHeader } from "./NewsHeader";
import { NewsFilters } from "./NewsFilters";
import { NewsTable } from "./NewsTable";
import { useMemo, useState } from "react";

interface NewsManagementProps {
  onNewsSelect?: (newsId: number) => void;
}

export function NewsManagement({ onNewsSelect }: NewsManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <NewsHeader />
        
        {/* Filters */}
        <div className="mb-6">
          <NewsFilters
            searchQuery={searchQuery}
            category={category}
            status={status}
            onSearchQueryChange={setSearchQuery}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
          />
        </div>

        {/* Data Table */}
        <NewsTable
          onNewsSelect={onNewsSelect}
          searchQuery={searchQuery}
          category={category}
          status={status}
        />
      </div>
    </div>
  );
}