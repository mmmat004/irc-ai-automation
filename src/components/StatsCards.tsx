import { useState, useEffect } from "react";
import { FileText, Clock, TrendingUp, Tag } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

interface StatsData {
  title: string;
  value: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
}

export function StatsCards() {
  const { t } = useLanguage();
  const [statsData, setStatsData] = useState<StatsData[]>([
    { title: t('dashboard.totalNews'), value: "0", icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: t('dashboard.pendingVerification'), value: "0", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: t('dashboard.published'), value: "0", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
    { title: t('dashboard.categories'), value: "0", icon: Tag, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_ENDPOINTS.DASHBOARD_COUNT_OVERALL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map API response to stats - matching exact API response format
          const totalNews = data.totalNews || 0;
          const pendingCount = data.totalPendingNews || 0;
          const publishedCount = data.totalPublishedNews || 0;
          const categoriesCount = data.totalCategory || 0;

          setStatsData([
            { title: t('dashboard.totalNews'), value: totalNews.toLocaleString(), icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50" },
            { title: t('dashboard.pendingVerification'), value: pendingCount.toLocaleString(), icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
            { title: t('dashboard.published'), value: publishedCount.toLocaleString(), icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
            { title: t('dashboard.categories'), value: categoriesCount.toLocaleString(), icon: Tag, color: "text-purple-600", bgColor: "bg-purple-50" },
          ]);
        } else {
          console.error('Failed to fetch dashboard stats:', response.status);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}