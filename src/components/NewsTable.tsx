import { useState, useMemo, useEffect } from "react";
import { Check, X, CheckSquare, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { FilterState } from "./NewsFilters";
import { API_ENDPOINTS } from "../config/api";

interface NewsItem {
  id: string | number;
  title: string;
  category: string;
  status: string;
  date: string;
  time?: string;
}

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
  onNewsSelect?: (newsId: string | number) => void;
  filters?: FilterState;
}

export function NewsTable({ onNewsSelect, filters }: NewsTableProps) {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch news data from API using POST /news/search
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const searchPayload: any = {};
        
        // Build search payload from filters
        if (filters?.search) {
          searchPayload.search = filters.search;
        }
        if (filters?.category && filters.category !== "all") {
          searchPayload.category = filters.category;
        }
        if (filters?.status && filters.status !== "all") {
          searchPayload.status = filters.status;
        }
        if (filters?.dateRange && filters.dateRange !== "all") {
          searchPayload.dateRange = filters.dateRange;
        }

        const response = await fetch(API_ENDPOINTS.NEWS_SEARCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(searchPayload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('NewsTable API Response:', data);
          console.log('NewsTable Response Type:', typeof data);
          console.log('NewsTable Is Array:', Array.isArray(data));
          console.log('NewsTable data.items:', data.items);
          console.log('NewsTable data.data:', data.data);
          console.log('NewsTable data.news:', data.news);
          
          // API returns: { currentPage, totalPage, totalItems, items: [...] }
          let rawItems: any[] = [];
          if (Array.isArray(data)) {
            rawItems = data;
          } else if (data && typeof data === 'object') {
            rawItems = data.items || data.data || data.news || data.results || [];
          }
          
          console.log('NewsTable Parsed Items:', rawItems);
          console.log('NewsTable Items Length:', rawItems.length);
          
          if (rawItems.length === 0) {
            console.warn('NewsTable: No items found in response!');
          }
          
          // Map API response fields to component interface
          const newsItems: NewsItem[] = rawItems.map((item: any, index: number) => {
            console.log(`NewsTable Item ${index}:`, item);
            return {
              id: item.id || item._id || `temp-${index}`,
              title: item.title || '',
              category: item.category || '',
              status: item.status || 'pending', // Default to pending if not provided
              date: item.date || item.createdAt || new Date().toISOString().split('T')[0],
              time: item.time || '',
            };
          });
          
          console.log('NewsTable Mapped Items:', newsItems);
          console.log('NewsTable Setting state with', newsItems.length, 'items');
          setNewsData(newsItems);
        } else {
          console.error('Failed to fetch news:', response.status);
          toast.error('Failed to load news articles. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Cannot connect to server. Check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, [filters]);

  const handleNewsClick = (newsId: string | number) => {
    if (onNewsSelect) {
      onNewsSelect(newsId);
    }
  };

  const handleVerifyNews = async (newsId: string | number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to verify news article. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying news:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  const handleRejectNews = async (newsId: string | number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to reject news article. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting news:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  const handleSelectItem = (newsId: string | number, event: React.MouseEvent) => {
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

  const handleBulkVerify = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to verify");
      return;
    }
    
    try {
      const promises = Array.from(selectedItems).map(id =>
        fetch(API_ENDPOINTS.NEWS_STATUS, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: String(id),
            status: 'verified',
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSucceeded = results.every(res => res.ok);

      if (allSucceeded) {
        setNewsData(prevData => 
          prevData.map(news => 
            selectedItems.has(news.id) 
              ? { ...news, status: 'verified' }
              : news
          )
        );
        toast.success(`${selectedItems.size} items have been verified successfully!`);
        setSelectedItems(new Set());
      } else {
        toast.error('Some items failed to verify. Please try again.');
      }
    } catch (error) {
      console.error('Error bulk verifying news:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  const handleBulkReject = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to reject");
      return;
    }
    
    try {
      const promises = Array.from(selectedItems).map(id =>
        fetch(API_ENDPOINTS.NEWS_STATUS, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            id: String(id),
            status: 'rejected',
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSucceeded = results.every(res => res.ok);

      if (allSucceeded) {
        setNewsData(prevData => 
          prevData.map(news => 
            selectedItems.has(news.id) 
              ? { ...news, status: 'rejected' }
              : news
          )
        );
        toast.success(`${selectedItems.size} items have been rejected!`);
        setSelectedItems(new Set());
      } else {
        toast.error('Some items failed to reject. Please try again.');
      }
    } catch (error) {
      console.error('Error bulk rejecting news:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  // Use newsData directly from API (filters are applied server-side)
  const filteredNewsData = newsData;

  // Debug: Log when newsData changes
  useEffect(() => {
    console.log('NewsTable newsData state updated:', newsData);
    console.log('NewsTable newsData length:', newsData.length);
  }, [newsData]);

  const pendingItems = filteredNewsData.filter(news => news.status === 'pending');
  const isAllSelected = pendingItems.length > 0 && selectedItems.size === pendingItems.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
          <p className="mt-4 text-sm text-gray-600">Loading news articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Results Counter and Bulk Actions */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredNewsData.length} article{filteredNewsData.length !== 1 ? 's' : ''}
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
                  {news.time && <div className="text-sm text-gray-500">{news.time}</div>}
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