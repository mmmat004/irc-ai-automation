import { useEffect, useState } from "react";
import { Target, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { API_ENDPOINTS } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

interface CategoryOverview {
  totalCategories: number;
  activeCategories: number;
  totalArticles: number;
}

export function CategoryStats() {
  const { t } = useLanguage();
  const [overview, setOverview] = useState<CategoryOverview>({
    totalCategories: 0,
    activeCategories: 0,
    totalArticles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.CATEGORY_OVERVIEW, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isCancelled) return;

        const mappedOverview: CategoryOverview = {
          totalCategories:
            Number(
              data.totalCategories ??
                data.totalCategory ??
                data.total ??
                data.count ??
                0
            ) || 0,
          activeCategories:
            Number(
              data.totalActiveCategory ??
                data.activeCategories ??
                data.activeCategory ??
                data.active ??
                data.activeCount ??
                0
            ) || 0,
          totalArticles:
            Number(
              data.totalArticles ??
                data.totalNews ??
                data.articleCount ??
                data.totalArticle ??
                data.articles ??
                0
            ) || 0,
        };

        setOverview(mappedOverview);
      } catch (err) {
        console.error("Failed to fetch category overview:", err);
        if (!isCancelled) {
          setError(t('categories.unableToLoad'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchOverview();

    return () => {
      isCancelled = true;
    };
  }, []);

  const statsData = [
    {
      title: t('categoryStats.totalCategories'),
      value: overview.totalCategories,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t('categoryStats.activeCategories'),
      value: overview.activeCategories,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: t('categoryStats.totalArticles'),
      value: overview.totalArticles,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('categoryStats.overview')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`category-stat-skeleton-${index}`}
                className="border border-gray-200 shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-12 w-12 bg-gray-200 rounded-lg self-end animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}