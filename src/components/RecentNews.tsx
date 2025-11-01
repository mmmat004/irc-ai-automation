import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "sonner";

interface RecentNewsItem {
  id: string | number;
  title: string;
  category: string;
  status: string;
  date?: string;
  time?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'verified':
      return 'bg-orange-100 text-orange-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface RecentNewsProps {
  onNewsSelect?: (newsId: string | number) => void;
}

export function RecentNews({ onNewsSelect }: RecentNewsProps) {
  const [recentNewsData, setRecentNewsData] = useState<RecentNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        setIsLoading(true);
        // Fetch recent news (limit to 4 most recent)
        const response = await fetch(API_ENDPOINTS.NEWS_SEARCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            limit: 4,
            sortBy: 'date',
            sortOrder: 'desc',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('RecentNews API Response:', data);
          
          // API returns: { currentPage, totalPage, totalItems, items: [...] }
          const rawItems = Array.isArray(data) ? data : (data.items || data.data || data.news || []);
          console.log('RecentNews Parsed Items:', rawItems);
          
          // Map API response fields to component interface
          const newsItems: RecentNewsItem[] = rawItems.slice(0, 4).map((item: any) => ({
            id: item.id,
            title: item.title || '',
            category: item.category || '',
            status: item.status || 'pending',
            date: item.date || item.createdAt || '',
            time: item.time || '',
          }));
          
          console.log('RecentNews Mapped Items:', newsItems);
          setRecentNewsData(newsItems);
        } else {
          console.error('Failed to fetch recent news:', response.status);
        }
      } catch (error) {
        console.error('Error fetching recent news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentNews();
  }, []);

  const handleNewsClick = (newsId: string | number) => {
    if (onNewsSelect) {
      onNewsSelect(newsId);
    }
  };

  const formatTimeAgo = (date: string) => {
    if (!date) return '';
    const newsDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - newsDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent News</h2>
        <div className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-foreground mb-6">Recent News</h2>
      
      {recentNewsData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No recent news available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentNewsData.map((news) => (
            <div 
              key={news.id} 
              className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-xl transition-all duration-200 group cursor-pointer hover:-translate-y-0.5 hover:shadow-sm"
              onClick={() => handleNewsClick(news.id)}
            >
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{news.category}</span>
                  <span className="text-sm text-muted-foreground/50">•</span>
                  <span className="text-sm text-muted-foreground">
                    {news.date ? formatTimeAgo(news.date) : (news.time || '')}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 group-hover:scale-105 ${getStatusBadge(news.status)}`}>
                {news.status.charAt(0).toUpperCase() + news.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}