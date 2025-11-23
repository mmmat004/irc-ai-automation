import { useState, useMemo, useEffect } from "react";
import { Check, X, CheckSquare, Square, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { showSuccess, showError, NotificationMessages } from "../utils/notifications";
import { FilterState } from "./NewsFilters";
import { API_ENDPOINTS } from "../config/api";
import { VerifyConfirmationModal } from "./VerifyConfirmationModal";
import { RejectConfirmationModal } from "./RejectConfirmationModal";

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

interface CategoryOption {
  id: string;
  name: string;
}

export function NewsTable({ onNewsSelect, filters }: NewsTableProps) {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageLimit] = useState(10);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [verifyConfirmModal, setVerifyConfirmModal] = useState<{
    open: boolean;
    newsId: string | number | null;
  }>({ open: false, newsId: null });
  const [rejectConfirmModal, setRejectConfirmModal] = useState<{
    open: boolean;
    newsId: string | number | null;
  }>({ open: false, newsId: null });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.WORKFLOW_CONFIG_CATEGORY, {
          credentials: 'include'
        });

        if (response.ok) {
          const categoriesData = await response.json();
          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch news data from API using POST /news/search
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        
        // Map category name to category ID
        let categoryId: string = "";
        if (filters?.category && filters.category !== "all") {
          const category = categories.find(cat => cat.name === filters.category);
          if (category) {
            categoryId = String(category.id);
          } else {
            // If category not found, try to use the value directly (in case it's already an ID)
            categoryId = String(filters.category);
          }
        }

        // Handle date range filter
        let startDate: string | null = null;
        let endDate: string | null = null;
        
        if (filters?.dateRange && filters.dateRange !== "all" && typeof filters.dateRange === 'object') {
          if (filters.dateRange.from) {
            startDate = filters.dateRange.from.toISOString().split('T')[0];
          }
          if (filters.dateRange.to) {
            endDate = filters.dateRange.to.toISOString().split('T')[0];
          }
        }

        // Build search payload according to API specification
        const searchPayload: {
          page: number;
          limit: number;
          keyword: string | null;
          categoryId: string;
          status: string | null;
          startDate: string | null;
          endDate: string | null;
        } = {
          page: currentPage,
          limit: pageLimit,
          keyword: filters?.search && filters.search.trim() !== "" ? filters.search.trim() : null,
          categoryId: categoryId,
          status: filters?.status && filters.status !== "all" ? filters.status : null,
          startDate: startDate,
          endDate: endDate,
        };

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
          
          // API returns: { currentPage, totalPage, totalItems, items: [...] }
          let rawItems: any[] = [];
          if (Array.isArray(data)) {
            rawItems = data;
          } else if (data && typeof data === 'object') {
            rawItems = data.items || data.data || data.news || data.results || [];
          }
          
          // Update pagination info
          if (data && typeof data === 'object') {
            if (typeof data.currentPage === 'number') {
              setCurrentPage(data.currentPage);
            }
            if (typeof data.totalPage === 'number') {
              setTotalPages(data.totalPage);
            }
            if (typeof data.totalItems === 'number') {
              setTotalItems(data.totalItems);
            }
          }
          
          // Map API response fields to component interface
          const newsItems: NewsItem[] = rawItems.map((item: any, index: number) => ({
            id: item.id || item._id || `temp-${index}`,
            title: item.title || '',
            category: item.category || '',
            status: item.status || 'pending', // Default to pending if not provided
            date: item.date || item.createdAt || new Date().toISOString().split('T')[0],
            time: item.time || '',
          }));
          
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
  }, [filters, currentPage, pageLimit, categories]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleNewsClick = (newsId: string | number) => {
    if (onNewsSelect) {
      onNewsSelect(newsId);
    }
  };

  const handleVerifyNews = (newsId: string | number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setVerifyConfirmModal({ open: true, newsId });
  };

  const handleVerifyConfirm = async () => {
    const newsId = verifyConfirmModal.newsId;
    if (!newsId) return;

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
          showSuccess(NotificationMessages.newsVerified(newsItem.title));
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        showError(NotificationMessages.newsVerificationFailed(errorData.message));
      }
    } catch (error) {
      console.error('Error verifying news:', error);
      showError(NotificationMessages.connectionError);
    } finally {
      setVerifyConfirmModal({ open: false, newsId: null });
    }
  };

  const handleRejectNews = (newsId: string | number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setRejectConfirmModal({ open: true, newsId });
  };

  const handleRejectConfirm = async () => {
    const newsId = rejectConfirmModal.newsId;
    if (!newsId) return;

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
    } finally {
      setRejectConfirmModal({ open: false, newsId: null });
    }
  };

  const handleSelectItem = (newsId: string | number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent row click
    }
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

  const handleCancelVerify = async (newsId: string | number, event: React.MouseEvent) => {
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
          status: 'pending',
        }),
      });

      if (response.ok) {
        setNewsData(prevData => 
          prevData.map(news => 
            news.id === newsId 
              ? { ...news, status: 'pending' }
              : news
          )
        );
        const newsItem = newsData.find(news => news.id === newsId);
        if (newsItem) {
          toast.success(`"${newsItem.title}" verification has been cancelled.`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to cancel verification. Please try again.');
      }
    } catch (error) {
      console.error('Error canceling verification:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  const handleCancelReject = async (newsId: string | number, event: React.MouseEvent) => {
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
          status: 'pending',
        }),
      });

      if (response.ok) {
        setNewsData(prevData => 
          prevData.map(news => 
            news.id === newsId 
              ? { ...news, status: 'pending' }
              : news
          )
        );
        const newsItem = newsData.find(news => news.id === newsId);
        if (newsItem) {
          toast.success(`"${newsItem.title}" rejection has been cancelled.`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to cancel rejection. Please try again.');
      }
    } catch (error) {
      console.error('Error canceling rejection:', error);
      toast.error('Cannot connect to server. Check your connection.');
    }
  };

  const handleSelectAll = () => {
    const selectableItems = filteredNewsData.filter(news => news.status === 'pending' || news.status === 'verified');
    const selectableIds = selectableItems.map(news => news.id);
    const allSelected = selectableIds.every(id => selectedItems.has(id));
    
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(selectableIds));
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

  const pendingItems = filteredNewsData.filter(news => news.status === 'pending');
  const selectableItems = filteredNewsData.filter(news => news.status === 'pending' || news.status === 'verified');
  const isAllSelected = selectableItems.length > 0 && selectableItems.every(item => selectedItems.has(item.id));

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
          Showing {filteredNewsData.length} of {totalItems} article{totalItems !== 1 ? 's' : ''}
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
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
                  disabled={selectableItems.length === 0}
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
              filteredNewsData.map((news, index) => {
                const isSelected = selectedItems.has(news.id);
                const isSelectable = news.status === 'pending' || news.status === 'verified';
                
                return (
                  <tr 
                    key={news.id} 
                    className={`
                      ${isSelected ? "bg-blue-50 border-l-4 border-l-500" : index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      cursor-pointer hover:bg-gray-100 transition-all
                      ${isSelected ? "hover:bg-blue-100" : ""}
                    `}
                    onClick={() => {
                      if (isSelectable) {
                        handleSelectItem(news.id);
                      } else {
                        handleNewsClick(news.id);
                      }
                    }}
                  >
                <td className="px-6 py-4">
                  {isSelectable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(news.id, e);
                      }}
                      className="flex items-center justify-center"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                      )}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p 
                      className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNewsClick(news.id);
                      }}
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
                    {news.status === 'verified' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-50"
                        onClick={(e) => handleCancelVerify(news.id, e)}
                        title="Cancel verification - set back to pending"
                      >
                        <RotateCcw className="w-4 h-4 text-orange-600" />
                      </Button>
                    )}
                    {news.status === 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-50"
                        onClick={(e) => handleCancelReject(news.id, e)}
                        title="Cancel rejection - set back to pending"
                      >
                        <RotateCcw className="w-4 h-4 text-orange-600" />
                      </Button>
                    )}
                  </div>
                </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({totalItems} total items)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="h-8 px-3"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={isLoading}
                    className={`h-8 w-8 p-0 ${currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Verify Confirmation Modal */}
      <VerifyConfirmationModal
        open={verifyConfirmModal.open}
        onOpenChange={(open) => setVerifyConfirmModal({ open, newsId: open ? verifyConfirmModal.newsId : null })}
        onConfirm={handleVerifyConfirm}
      />

      {/* Reject Confirmation Modal */}
      <RejectConfirmationModal
        open={rejectConfirmModal.open}
        onOpenChange={(open) => setRejectConfirmModal({ open, newsId: open ? rejectConfirmModal.newsId : null })}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}