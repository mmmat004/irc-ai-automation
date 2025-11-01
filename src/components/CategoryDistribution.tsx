import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

interface CategoryData {
  name: string;
  count: number;
  color: string;
}

const colors = [
  "bg-purple-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-lime-500",
  "bg-teal-500",
  "bg-violet-500",
  "bg-rose-500",
];

export function CategoryDistribution() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_ENDPOINTS.NEWS_SEARCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = await response.json();
          const newsItems = Array.isArray(data) ? data : (data.data || data.news || []);
          
          // Count news by category
          const categoryCounts: Record<string, number> = {};
          newsItems.forEach((item: any) => {
            if (item.category) {
              categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
            }
          });

          // Convert to array and sort by count
          const categories = Object.entries(categoryCounts)
            .map(([name, count], index) => ({
              name,
              count: count as number,
              color: colors[index % colors.length],
            }))
            .sort((a, b) => b.count - a.count);

          setCategoryData(categories);
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
        <h2 className="text-xl font-semibold text-foreground mb-6">Category Distribution</h2>
        <div className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-foreground mb-6">Category Distribution</h2>
      
      {categoryData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No category data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 group cursor-pointer hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${category.color} group-hover:scale-125 transition-transform duration-200`} />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{category.name}</span>
              </div>
              <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg group-hover:scale-105 transition-all duration-200">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}