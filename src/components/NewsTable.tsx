import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { FilterState } from "./NewsFilters";

const initialNewsData = [
  {
    id: 1,
    title: "Breaking: Tech Giants Announce New AI Partnership",
    category: "Technology",
    status: "published",
    date: "2025-08-15",
    time: "14:30"
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    category: "Environment",
    status: "verified",
    date: "2025-08-15",
    time: "12:15"
  },
  {
    id: 3,
    title: "Market Update: Stocks Rise on Positive Economic Data",
    category: "Business",
    status: "pending",
    date: "2025-08-25",
    time: "10:45"
  },
  {
    id: 4,
    title: "Sports: Championship Finals Set for This Weekend",
    category: "Sports",
    status: "verified",
    date: "2025-07-15",
    time: "09:20"
  },
  {
    id: 5,
    title: "Healthcare Innovation: New Treatment Shows Promise",
    category: "Health",
    status: "pending",
    date: "2025-07-25",
    time: "16:45"
  },
  {
    id: 6,
    title: "Entertainment Weekly: Award Season Predictions",
    category: "Entertainment",
    status: "published",
    date: "2025-07-25",
    time: "15:30"
  },
  {
    id: 7,
    title: "Political Analysis: Election Campaign Updates",
    category: "Politics",
    status: "verified",
    date: "2025-06-23",
    time: "13:15"
  },
  {
    id: 8,
    title: "Science Discovery: Breakthrough in Quantum Computing",
    category: "Science",
    status: "pending",
    date: "2025-06-19",
    time: "11:00"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
    case 'verified':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Verified</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getCategoryBadge = (category: string) => {
  return <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50">{category}</Badge>;
};

interface NewsTableProps {
  onNewsSelect?: (newsId: number) => void;
  filters?: FilterState;
}

export function NewsTable({ onNewsSelect, filters }: NewsTableProps) {
  const [newsData, setNewsData] = useState(initialNewsData);

  const handleNewsClick = (newsId: number) => {
    if (onNewsSelect) {
      onNewsSelect(newsId);
    }
  };

  const handleVerifyNews = (newsId: number) => {
    setNewsData(prevData => 
      prevData.map(news => 
        news.id === newsId 
          ? { ...news, status: 'verified' }
          : news
      )
    );
    
    const newsItem = newsData.find(news => news.id === newsId);
    if (newsItem) {
      toast.success(`"${newsItem.title}" has been verified successfully!`);
    }
  };

  // Filter the news data based on current filters
  const filteredNewsData = useMemo(() => {
    if (!filters) return newsData;

    return newsData.filter(news => {
      // Search filter
      if (filters.search && !news.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category !== "all" && news.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && news.status !== filters.status) {
        return false;
      }

      // Date filter
      if (filters.dateRange !== "all") {
        const newsDate = new Date(news.date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        switch (filters.dateRange) {
          case "today":
            if (newsDate.toDateString() !== today.toDateString()) return false;
            break;
          case "yesterday":
            if (newsDate.toDateString() !== yesterday.toDateString()) return false;
            break;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (newsDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (newsDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [newsData, filters]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Results Counter */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {filteredNewsData.length} of {newsData.length} articles
          {filters && (filters.search || filters.category !== "all" || filters.status !== "all" || filters.dateRange !== "all") 
            ? " (filtered)" 
            : ""
          }
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Verify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredNewsData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="mb-2">No news articles found</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredNewsData.map((news, index) => (
              <tr key={news.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p 
                      className="font-medium text-gray-900 truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleNewsClick(news.id)}
                    >
                      {news.title}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getCategoryBadge(news.category)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(news.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{news.date}</div>
                  <div className="text-sm text-gray-500">{news.time}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {news.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-50"
                        onClick={() => handleVerifyNews(news.id)}
                        title="Verify this news article"
                      >
                        <Check className="w-4 h-4 text-orange-600" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}