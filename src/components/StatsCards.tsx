import { useState, useEffect } from "react";
import { FileText, Clock, TrendingUp, Tag } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

interface StatsData {
  title: string;
  value: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
}

export function StatsCards() {
  const [statsData, setStatsData] = useState<StatsData[]>([
    { title: "Total News", value: "0", icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Pending Verification", value: "0", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Published This Week", value: "0", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Categories", value: "0", icon: Tag, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all news to calculate stats
        const [allNewsResponse, pendingNewsResponse, publishedNewsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.NEWS_SEARCH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({}),
          }),
          fetch(API_ENDPOINTS.NEWS_SEARCH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: 'pending' }),
          }),
          fetch(API_ENDPOINTS.NEWS_SEARCH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: 'published' }),
          }),
        ]);

        let totalNews = 0;
        let pendingCount = 0;
        let publishedCount = 0;
        const categories = new Set<string>();

        if (allNewsResponse.ok) {
          const allData = await allNewsResponse.json();
          const allNews = Array.isArray(allData) ? allData : (allData.data || allData.news || []);
          totalNews = allNews.length;
          allNews.forEach((item: any) => {
            if (item.category) categories.add(item.category);
          });
        }

        if (pendingNewsResponse.ok) {
          const pendingData = await pendingNewsResponse.json();
          const pendingNews = Array.isArray(pendingData) ? pendingData : (pendingData.data || pendingData.news || []);
          pendingCount = pendingNews.length;
        }

        if (publishedNewsResponse.ok) {
          const publishedData = await publishedNewsResponse.json();
          const publishedNews = Array.isArray(publishedData) ? publishedData : (publishedData.data || publishedData.news || []);
          // Filter by this week
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          publishedCount = publishedNews.filter((item: any) => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return itemDate >= weekAgo;
          }).length;
        }

        setStatsData([
          { title: "Total News", value: totalNews.toLocaleString(), icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "Pending Verification", value: pendingCount.toLocaleString(), icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "Published This Week", value: publishedCount.toLocaleString(), icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Categories", value: categories.size.toLocaleString(), icon: Tag, color: "text-purple-600", bgColor: "bg-purple-50" },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

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