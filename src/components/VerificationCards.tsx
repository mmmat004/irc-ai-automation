import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { VerificationCard } from "./VerificationCard";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../config/api";

interface NewsItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  time?: string;
  preview?: string;
  sources?: string[];
  originalSources?: Array<{ name: string; url: string }>;
  content?: string;
  intro?: string;
  status?: string;
}

interface VerificationCardsProps {
  onNewsSelect?: (newsId: string | number) => void;
}

export function VerificationCards({ onNewsSelect }: VerificationCardsProps) {
  const { language } = useLanguage();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendingNews = async () => {
      try {
        setIsLoading(true);
        // Fetch pending news items
        const response = await fetch(API_ENDPOINTS.NEWS_SEARCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'irc-lang': language === 'th' ? 'th' : 'en',
          },
          credentials: 'include',
          body: JSON.stringify({
            status: 'pending',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // API returns: { currentPage, totalPage, totalItems, items: [...] }
          const rawItems = Array.isArray(data) ? data : (data.items || data.data || data.news || []);
          
          // Map API response fields to component interface
          const newsItems: NewsItem[] = rawItems.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            category: item.category || '',
            date: item.date || item.createdAt || '',
            time: item.time || '',
            preview: item.introduction || item.intro || '',
            sources: item.source ? [item.source] : (item.sources || []),
            originalSources: item.source ? [{ name: item.source, url: item.source }] : undefined,
            content: item.hook || item.introduction || item.intro || '',
            intro: item.introduction || item.intro || '',
            status: item.status || 'pending',
          }));
          
          setNewsData(newsItems);
        } else {
          console.error('Failed to fetch pending news:', response.status);
        }
      } catch (error) {
        console.error('Error fetching pending news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingNews();
  }, [language]);

  const handleApprove = async (newsId: string | number, notes: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.NEWS_STATUS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: String(newsId),
          status: 'verified',
        }),
      });

      if (response.ok) {
        setNewsData(prevData =>
          prevData.filter(item => item.id !== newsId)
        );
        const newsItem = newsData.find(item => item.id === newsId);
        if (newsItem) {
          toast.success(`"${newsItem.title}" has been approved successfully!`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to approve news article. Please try again.');
      }
    } catch (error) {
      console.error('Error approving news:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  const handleReject = async (newsId: string | number, notes: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.NEWS_STATUS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: String(newsId),
          status: 'rejected',
        }),
      });

      if (response.ok) {
        setNewsData(prevData =>
          prevData.filter(item => item.id !== newsId)
        );
        const newsItem = newsData.find(item => item.id === newsId);
        if (newsItem) {
          toast.error(`"${newsItem.title}" has been rejected.`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to reject news article. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting news:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  // Filter out approved and rejected items to only show pending ones
  const pendingItems = newsData.filter(item => item.status === 'pending' || !item.status);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">Loading pending news...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingItems.length > 0 ? (
        pendingItems.map((newsItem) => {
          // Map API response to VerificationCard expected format
          const mappedItem = {
            ...newsItem,
            preview: newsItem.preview || newsItem.intro || '',
            sources: newsItem.sources || (newsItem.originalSources?.map(s => s.name) || []),
            content: newsItem.content || newsItem.intro || '',
          };
          return (
            <VerificationCard 
              key={newsItem.id} 
              newsItem={mappedItem} 
              onNewsSelect={onNewsSelect}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          );
        })
      ) : (
        <div className="text-center py-12">
          <div className="bg-muted rounded-xl p-8">
            <h3 className="text-lg font-medium text-foreground mb-2">No items pending verification</h3>
            <p className="text-muted-foreground">All news items have been processed.</p>
          </div>
        </div>
      )}
    </div>
  );
}