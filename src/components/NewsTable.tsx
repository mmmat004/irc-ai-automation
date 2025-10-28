import { useState, useMemo } from "react";
import { Check, X, CheckSquare, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { FilterState } from "./NewsFilters";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  status: string;
  date: string;
  time: string;
}

const initialNewsData: NewsItem[] = [
  {
    id: 1,
    title: "Breaking: Tech Giants Announce New AI Partnership",
    category: "AI",
    status: "published",
    date: "2024-01-15",
    time: "14:30"
  },
  {
    id: 2,
    title: "Startup Funding: Series A Round Reaches $50M",
    category: "Startup",
    status: "verified",
    date: "2024-01-15",
    time: "12:15"
  },
  {
    id: 3,
    title: "Market Update: Economic Indicators Show Growth",
    category: "Economic",
    status: "pending",
    date: "2024-01-15",
    time: "10:45"
  },
  {
    id: 4,
    title: "Digital Transformation: Enterprise Cloud Migration Trends",
    category: "Digital Transform",
    status: "verified",
    date: "2024-01-15",
    time: "09:20"
  },
  {
    id: 5,
    title: "Data Analytics: New Machine Learning Framework Released",
    category: "Data",
    status: "pending",
    date: "2024-01-14",
    time: "16:45"
  },
  {
    id: 6,
    title: "Marketing Automation: Consumer Behavior Analysis",
    category: "Marketing",
    status: "published",
    date: "2024-01-14",
    time: "15:30"
  },
  {
    id: 7,
    title: "Financial Markets: Cryptocurrency Regulation Updates",
    category: "Finance",
    status: "verified",
    date: "2024-01-14",
    time: "13:15"
  },
  {
    id: 8,
    title: "Technology Innovation: 5G Infrastructure Expansion",
    category: "Technology",
    status: "pending",
    date: "2024-01-14",
    time: "11:00"
  },
  {
    id: 9,
    title: "Business Intelligence: Q4 Revenue Report Analysis",
    category: "Business",
    status: "verified",
    date: "2024-01-13",
    time: "14:20"
  }
];

const filterNewsData = (newsData: NewsItem[], filters: FilterState): NewsItem[] => {
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
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
    case 'verified':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Verified</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
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
  const [newsData, setNewsData] = useState<NewsItem[]>(initialNewsData);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleNewsClick = (newsId: number) => {
    if (onNewsSelect) {
      onNewsSelect(newsId);
    }
  };

  const handleVerifyNews = (newsId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
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

  const handleRejectNews = (newsId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setNewsData(prevData => 
      prevData.map(news => 
        news.id === newsId 
          ? { ...news, status: 'rejected' }
          : news
      )
    );
    
    const newsItem = newsData.find(news => news.id === newsId);
    if (newsItem) {
      toast.error(`"${newsItem.title}" has been rejected!`);
    }
  };

  const handleSelectItem = (newsId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const pendingItems = filteredNewsData.filter(news => news.status === 'pending');
    if (selectedItems.size === pendingItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(pendingItems.map(news => news.id)));
    }
  };

  const handleBulkVerify = () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to verify");
      return;
    }
    
    setNewsData(prevData => 
      prevData.map(news => 
        selectedItems.has(news.id) 
          ? { ...news, status: 'verified' }
          : news
      )
    );
    
    toast.success(`${selectedItems.size} items have been verified successfully!`);
    setSelectedItems(new Set());
  };

  const handleBulkReject = () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to reject");
      return;
    }
    
    setNewsData(prevData => 
      prevData.map(news => 
        selectedItems.has(news.id) 
          ? { ...news, status: 'rejected' }
          : news
      )
    );
    
    toast.error(`${selectedItems.size} items have been rejected!`);
    setSelectedItems(new Set());
  };

  // Filter the news data based on current filters
  const filteredNewsData = useMemo(() => {
    if (!filters) return newsData;
    return filterNewsData(newsData, filters);
  }, [newsData, filters]);

  const pendingItems = filteredNewsData.filter(news => news.status === 'pending');
  const isAllSelected = pendingItems.length > 0 && selectedItems.size === pendingItems.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Results Counter and Bulk Actions */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredNewsData.length} of {newsData.length} articles
          {filters && (filters.search || filters.category !== "all" || filters.status !== "all" || filters.dateRange !== "all") 
            ? " (filtered)" 
            : ""
          }
        </p>
        
        {selectedItems.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedItems.size} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkVerify}
              className="h-8 px-3 border-green-300 hover:bg-green-50 text-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Verify All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkReject}
              className="h-8 px-3 border-red-300 hover:bg-red-50 text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Reject All
            </Button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 hover:text-gray-700"
                  disabled={pendingItems.length === 0}
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                  Select All
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredNewsData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="mb-2">No news articles found</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredNewsData.map((news, index) => (
              <tr 
                key={news.id} 
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer hover:bg-gray-100 transition-colors`}
                onClick={() => handleNewsClick(news.id)}
              >
                <td className="px-6 py-4">
                  {news.status === 'pending' && (
                    <button
                      onClick={(e) => handleSelectItem(news.id, e)}
                      className="flex items-center justify-center"
                    >
                      {selectedItems.has(news.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="font-medium text-gray-900 truncate">
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
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-green-300 hover:bg-green-50"
                          onClick={(e) => handleVerifyNews(news.id, e)}
                          title="Verify this news article"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-red-300 hover:bg-red-50"
                          onClick={(e) => handleRejectNews(news.id, e)}
                          title="Reject this news article"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
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