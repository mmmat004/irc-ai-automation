import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { CategoryCard } from "./CategoryCard";
import { AddCategoryModal } from "./AddCategoryModal";
import { API_ENDPOINTS } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "sonner";

interface CategoryData {
  id: number | string;
  name: string;
  color?: string;
  description?: string;
  articleCount?: number;
  isActive?: boolean;
}

const colorPalette = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
];

interface CategoryCardsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
}

export function CategoryCards({ 
  searchQuery, 
  onSearchChange, 
  isAddModalOpen, 
  onCloseAddModal 
}: CategoryCardsProps) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => {
      window.clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("keyword", debouncedQuery.trim());

        const url = `${API_ENDPOINTS.CATEGORY_SEARCH}?${params.toString()}`;

        const response = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isCancelled) return;

        const rawItems: any[] = Array.isArray(data)
          ? data
          : data?.items ?? data?.categories ?? data?.data ?? [];

        // Debug: Log first item to see structure
        if (rawItems.length > 0) {
          console.log('Sample category item from API:', rawItems[0]);
        }

        const mappedCategories: CategoryData[] = rawItems
          .map((item, index) => {
            // Always use the actual database ID - prioritize _id (MongoDB standard)
            // Check all possible ID fields
            const id =
              item._id ??  // MongoDB _id is most common
              item.id ??
              item.categoryId ??
              item.category_id;
            
            // If no valid ID found, skip this item
            if (!id) {
              console.error('Category item missing ID, skipping:', item);
              return null;
            }
            
            // Warn if we're about to use a generated ID (shouldn't happen now)
            if (String(id).startsWith('category-')) {
              console.warn('Warning: Using generated ID instead of database ID:', id, item);
            }

          const color =
            item.color ??
            item.hexColor ??
            colorPalette[index % colorPalette.length];

          const articleCount =
            Number(
              item.articleCount ??
                item.totalNews ??
                item.article_count ??
                item.count ??
                item.totalArticles ??
                item.total ??
                item.articles ??
                0
            ) || 0;

          const isActive =
            typeof item.isVisible === "boolean"
              ? item.isVisible
              : typeof item.isActive === "boolean"
              ? item.isActive
              : typeof item.active === "boolean"
              ? item.active
              : item.status
              ? String(item.status).toLowerCase() !== "inactive"
              : true;

          return {
            id,
            name: item.name ?? item.categoryName ?? item.title ?? `Category ${index + 1}`,
            description: item.description ?? item.summary ?? "",
            articleCount,
            isActive,
            color,
          };
        });

        // Filter out null entries and ensure we have unique categories by id
        const validCategories = mappedCategories.filter((cat): cat is CategoryData => cat !== null);
        const uniqueCategories = validCategories.filter(
          (category, index, self) =>
            self.findIndex((item) => item.id === category.id) === index
        );

        setCategories(uniqueCategories);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to fetch categories:", err);
        if (!isCancelled) {
          setError(t('categories.unableToLoad'));
          setCategories([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [debouncedQuery, refreshTrigger, t]);

  // Function to refresh categories (can be called after adding)
  const refreshCategories = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((category) => {
      const query = searchQuery.toLowerCase();
      const description = category.description ?? "";
      return (
        category.name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
  }, [categories, searchQuery]);

  const handleToggleActive = async (categoryId: number | string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      console.error('Category not found:', categoryId);
      return;
    }

    // Ensure we have a valid database ID (not a generated one)
    if (String(categoryId).startsWith('category-')) {
      console.error('Invalid category ID (generated fallback):', categoryId);
      toast.error('Invalid category ID. Please refresh the page.');
      return;
    }

    const newIsActive = !category.isActive;

    // Optimistically update UI
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, isActive: newIsActive } : cat
      )
    );

    try {
      const response = await fetch(API_ENDPOINTS.CATEGORY_VISIBLE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          categoryId: String(categoryId), // This should be the actual database ID
          isVisible: newIsActive,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setCategories(prev => 
          prev.map(cat => 
            cat.id === categoryId ? { ...cat, isActive: !newIsActive } : cat
          )
        );
        throw new Error(`Failed to update visibility: ${response.status}`);
      }

      // Optionally refresh categories to ensure sync with backend
      // The optimistic update should be sufficient, but we can refresh if needed
    } catch (error) {
      console.error('Error updating category visibility:', error);
      toast.error(t('common.error'));
    }
  };


  const handleAddCategory = (newCategory: any) => {
    // This is called for backward compatibility, but we mainly use onCategoryAdded
    // The refresh will happen via onCategoryAdded callback
  };

  const handleCategoryAdded = () => {
    // Refresh the categories list after adding
    refreshCategories();
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('categories.management')}</h2>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('categories.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`category-card-skeleton-${index}`}
                className="border border-dashed border-gray-200 rounded-xl h-64 animate-pulse bg-gray-50"
              />
            ))
          : filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-12 border border-dashed border-gray-200 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  {error ? error : t('categories.noCategories')}
                </p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onToggleActive={handleToggleActive}
                />
              ))
            )}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onAddCategory={handleAddCategory}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}