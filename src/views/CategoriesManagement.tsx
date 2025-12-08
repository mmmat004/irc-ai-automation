import { useState } from "react";
import { CategoriesHeader } from "../components/CategoriesHeader";
import { CategoryStats } from "../components/CategoryStats";
import { CategoryCards } from "../components/CategoryCards";

export function CategoriesManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [overviewRefreshTrigger, setOverviewRefreshTrigger] = useState(0);

  const handleCategoryVisibilityChange = () => {
    // Trigger overview refresh when category visibility changes
    setOverviewRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Header */}
        <CategoriesHeader onAddCategory={() => setIsAddModalOpen(true)} />
        
        {/* Category Overview Stats */}
        <CategoryStats refreshTrigger={overviewRefreshTrigger} />
        
        {/* Category Management Cards */}
        <CategoryCards 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAddModalOpen={isAddModalOpen}
          onCloseAddModal={() => setIsAddModalOpen(false)}
          onCategoryVisibilityChange={handleCategoryVisibilityChange}
        />
      </div>
    </div>
  );
}


