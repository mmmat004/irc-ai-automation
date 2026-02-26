import { useState, useEffect } from "react";
import { Check, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { API_ENDPOINTS } from "../config/api";
import { useLanguage } from "../contexts/LanguageContext";

interface WorkflowLog {
  id: string | number;
  workflowName: string;
  status: "success" | "error" | "running" | "pending";
  timestamp: string;
  duration?: string;
  createdAt?: string;
  executionTime?: number;
}

interface WorkflowLogResponse {
  items?: WorkflowLog[];
  data?: WorkflowLog[];
  currentPage?: number;
  totalPage?: number;
  totalItems?: number;
  total?: number;
}

/** Normalize API status (may be Thai or English) to canonical English for UI logic */
function normalizeStatus(raw: string | undefined): WorkflowLog['status'] {
  if (!raw) return 'pending';
  const s = String(raw).trim().toLowerCase();
  // English
  if (['success', 'error', 'running', 'pending'].includes(s)) return s as WorkflowLog['status'];
  // Thai (API returns localized when irc-lang: th)
  if (raw === 'สำเร็จ') return 'success';
  if (raw === 'ข้อผิดพลาด') return 'error';
  if (raw === 'กำลังทำงาน' || raw === 'กำลังดำเนินการ') return 'running';
  if (raw === 'รอดำเนินการ') return 'pending';
  return 'pending';
}

export function RecentExecutions() {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageLimit = 10;

  useEffect(() => {
    const fetchWorkflowLogs = async () => {
      try {
        setIsLoading(true);
        
        const searchPayload = {
          page: currentPage,
          limit: pageLimit,
        };

        const response = await fetch(API_ENDPOINTS.WORKFLOW_LOG_SEARCH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'irc-lang': language === 'th' ? 'th' : 'en',
          },
          credentials: 'include',
          body: JSON.stringify(searchPayload),
        });

        if (response.ok) {
          const data: WorkflowLogResponse = await response.json();
          
          // Handle different response structures
          const rawItems = Array.isArray(data) 
            ? data 
            : (data.items || data.data || []);
          
          // Map API response to component format
          const mappedLogs: WorkflowLog[] = rawItems.map((item: any) => ({
            id: item.id || item.logId || Math.random(),
            workflowName: item.step || item.workflowName || item.workflow || item.name || 'Unknown Workflow',
            status: item.status != null && item.status !== ''
              ? normalizeStatus(item.status)
              : (item.success === true ? 'success' : item.success === false ? 'error' : 'pending'),
            timestamp: item.timestamp || item.createdAt || item.executedAt || new Date().toISOString(),
            duration: item.duration || 
                     (item.executionTime ? `${(item.executionTime / 1000).toFixed(1)}s` : undefined) ||
                     (item.durationMs ? `${(item.durationMs / 1000).toFixed(1)}s` : undefined),
            executionTime: item.executionTime || item.durationMs,
          }));

          setLogs(mappedLogs);
          
          // Extract pagination info
          if (data.currentPage !== undefined && data.totalPage !== undefined) {
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPage);
          } else if (data.totalPage !== undefined) {
            setTotalPages(data.totalPage);
          }
          
          if (data.totalItems !== undefined) {
            setTotalItems(data.totalItems);
          } else if (data.total !== undefined) {
            setTotalItems(data.total);
          } else {
            setTotalItems(mappedLogs.length);
          }
        } else {
          console.error('Failed to fetch workflow logs:', response.status);
          setLogs([]);
        }
      } catch (error) {
        console.error('Error fetching workflow logs:', error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflowLogs();
  }, [currentPage, language]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(',', '');
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{t('workflows.recentExecutions')}</h2>
      </div>
      
      {isLoading ? (
        <div className="p-6 text-center text-gray-500">
          {t('workflows.loading')}
        </div>
      ) : logs.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          {t('workflows.noLogs')}
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {logs.map((execution) => (
              <div key={execution.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {execution.status === 'success' ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ) : execution.status === 'error' ? (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{execution.workflowName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge 
                        className={
                          execution.status === 'success'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : execution.status === 'error'
                            ? 'bg-red-100 text-red-800 hover:bg-red-100'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        }
                      >
                        {execution.status === 'success' 
                          ? t('workflows.success')
                          : execution.status === 'error'
                          ? t('workflows.error')
                          : execution.status === 'running'
                          ? t('workflows.running')
                          : t('workflows.pending')}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatTimestamp(execution.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                {execution.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{execution.duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('workflows.showingPage')} {currentPage} {t('workflows.of')} {totalPages} ({totalItems} {t('workflows.totalItems')})
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
                  {t('common.previous')}
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
                  {t('common.next')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}