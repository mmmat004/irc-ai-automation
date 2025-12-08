import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

interface CategoryData {
  name: string;
  count: number;
  color: string; // This will be a hex color code from the API
}

export function CategoryDistribution() {
  const { t } = useLanguage();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true);
        // Fetch all categories using search with empty keyword
        const response = await fetch(`${API_ENDPOINTS.CATEGORY_SEARCH}?keyword=`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Handle different response formats
          const categories = Array.isArray(data) ? data : (data.items || data.data || data.categories || []);
          
          // Map category data to display format
          const categoryDataList = categories.map((category: any, index: number) => {
            // Use colorCode from API, fallback to a default color if not available
            const colorCode = category.colorCode || category.color || category.hexColor;
            // Convert hex color to a valid color string (use inline style later)
            const color = colorCode || `#${((index * 137.508) % 256).toString(16).padStart(2, '0')}${((index * 199.508) % 256).toString(16).padStart(2, '0')}${((index * 37.508) % 256).toString(16).padStart(2, '0')}`;
            
            return {
              name: category.name || category.category || '',
              count: category.totalNews || category.articleCount || category.count || 0,
              color: color,
            };
          }).sort((a: CategoryData, b: CategoryData) => b.count - a.count);

          setCategoryData(categoryDataList);
        } else {
          console.error('Failed to fetch category data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">{t('categoryDistribution.title')}</h2>
        <div className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-foreground mb-6">{t('categoryDistribution.title')}</h2>
      
      {categoryData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">{t('categoryDistribution.noData')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-foreground">{category.name}</span>
              </div>
              <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}