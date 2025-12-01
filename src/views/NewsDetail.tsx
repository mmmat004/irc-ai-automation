import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  ArrowLeft,
  Clock,
  Hash,
  ExternalLink,
  Share2,
  Bookmark,
  Globe,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { VerifyConfirmationModal } from "../components/VerifyConfirmationModal";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../config/api";
import { extractDateFromItem } from "../utils/dateUtils";

interface NewsDetailProps {
  newsId: string | number;
  onBack: () => void;
}

interface NewsSource {
  name: string;
  url: string;
}

interface NewsDetailData {
  id: string | number;
  title: string;
  category: string;
  status: string;
  date: string;
  time?: string;
  keywords?: string[];
  intro: string;
  hookContent?: string;
  summarizedContent?: string;
  originalSources?: NewsSource[];
}

export function NewsDetail({ newsId, onBack }: NewsDetailProps) {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<NewsDetailData | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);

  // Fetch news detail from API
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setIsLoading(true);
        // Fetch news by ID from MongoDB
        // Support both path parameter format: /news/{id} or query parameter: /news/?id={id}
        const url = `${API_ENDPOINTS.NEWS_GET}/${encodeURIComponent(String(newsId))}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'irc-lang': language === 'th' ? 'th' : 'en',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map API response fields to component interface
          // Use utility function to extract and normalize date to YYYY-MM-DD format
          const mappedNews: NewsDetailData = {
            id: data.id,
            title: data.title || '',
            category: data.category || '',
            status: data.status || 'pending',
            date: extractDateFromItem(data), // Use utility function to normalize date to YYYY-MM-DD
            time: data.time || '',
            keywords: data.keyword || data.keywords || [],
            intro: data.introduction || data.intro || '',
            hookContent: data.hook || '',
            summarizedContent: data.summary || '',
            originalSources: data.source 
              ? [{ name: data.source, url: data.source }]
              : (data.originalSources || []),
          };
          setNews(mappedNews);
        } else if (response.status === 404) {
          toast.error(t('newsDetail.notFound'));
          onBack();
        } else {
          console.error('Failed to fetch news detail:', response.status);
          toast.error(t('newsDetail.loadError'));
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
        toast.error(t('newsDetail.serverError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId, onBack, language]);

  const handleShare = () => {
    toast(t('newsDetail.linkCopied'));
  };

  const handleBookmark = () => {
    toast(t('newsDetail.articleBookmarked'));
  };

  const handleTranslate = () => {
    setIsTranslated(!isTranslated);
    toast(isTranslated ? t('newsDetail.switchedToEnglish') : t('newsDetail.switchedToThai'));
  };

  const handleVerifyClick = () => {
    setShowVerifyConfirm(true);
  };

  const handleVerifyConfirm = async () => {
    if (!news) return;

    setShowVerifyConfirm(false);
    try {
      setIsUpdatingStatus(true);
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
        // Check if response has content before parsing
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        let updatedNews = news;
        if (text && contentType?.includes('application/json')) {
          try {
            updatedNews = JSON.parse(text);
            setNews(updatedNews);
          } catch (e) {
            // If JSON parsing fails, just update local state
            setNews({ ...news, status: 'verified' });
          }
        } else {
          // Response is empty, update local state and refetch
          setNews({ ...news, status: 'verified' });
          // Refetch to get updated data from server
          const refreshResponse = await fetch(`${API_ENDPOINTS.NEWS_GET}/${encodeURIComponent(String(newsId))}`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'irc-lang': language === 'th' ? 'th' : 'en',
            },
            credentials: 'include',
          });
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const mappedNews: NewsDetailData = {
              id: refreshData.id,
              title: refreshData.title || '',
              category: refreshData.category || '',
              status: refreshData.status || 'verified',
              date: extractDateFromItem(refreshData), // Use utility function to normalize date
              time: refreshData.time || '',
              keywords: refreshData.keyword || refreshData.keywords || [],
              intro: refreshData.introduction || refreshData.intro || '',
              hookContent: refreshData.hook || '',
              summarizedContent: refreshData.summary || '',
              originalSources: refreshData.source 
                ? [{ name: refreshData.source, url: refreshData.source }]
                : (refreshData.originalSources || []),
            };
            setNews(mappedNews);
          }
        }
        toast.success(t('newsDetail.verifiedSuccess'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to verify news:', response.status, errorData);
        toast.error(errorData.message || t('newsDetail.loadError'));
      }
    } catch (error) {
      console.error('Error verifying news:', error);
      toast.error(t('newsDetail.serverError'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    if (!news) return;

    try {
      setIsUpdatingStatus(true);
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
        // Check if response has content before parsing
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        let updatedNews = news;
        if (text && contentType?.includes('application/json')) {
          try {
            updatedNews = JSON.parse(text);
            setNews(updatedNews);
          } catch (e) {
            // If JSON parsing fails, just update local state
            setNews({ ...news, status: 'rejected' });
          }
        } else {
          // Response is empty, update local state and refetch
          setNews({ ...news, status: 'rejected' });
          // Refetch to get updated data from server
          const refreshResponse = await fetch(`${API_ENDPOINTS.NEWS_GET}/${encodeURIComponent(String(newsId))}`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'irc-lang': language === 'th' ? 'th' : 'en',
            },
            credentials: 'include',
          });
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const mappedNews: NewsDetailData = {
              id: refreshData.id,
              title: refreshData.title || '',
              category: refreshData.category || '',
              status: refreshData.status || 'rejected',
              date: extractDateFromItem(refreshData),
              time: refreshData.time || '',
              keywords: refreshData.keyword || refreshData.keywords || [],
              intro: refreshData.introduction || refreshData.intro || '',
              hookContent: refreshData.hook || '',
              summarizedContent: refreshData.summary || '',
              originalSources: refreshData.source 
                ? [{ name: refreshData.source, url: refreshData.source }]
                : (refreshData.originalSources || []),
            };
            setNews(mappedNews);
          }
        }
        toast.success(t('newsDetail.rejectedSuccess'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to reject news:', response.status, errorData);
        toast.error(errorData.message || t('newsDetail.loadError'));
      }
    } catch (error) {
      console.error('Error rejecting news:', error);
      toast.error(t('newsDetail.serverError'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelVerify = async () => {
    if (!news) return;

    try {
      setIsUpdatingStatus(true);
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
        // Check if response has content before parsing
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        if (text && contentType?.includes('application/json')) {
          try {
            const updatedNews = JSON.parse(text);
            const mappedNews: NewsDetailData = {
              id: updatedNews.id,
              title: updatedNews.title || news.title,
              category: updatedNews.category || news.category,
              status: updatedNews.status || 'pending',
              date: extractDateFromItem(updatedNews.date ? updatedNews : { ...updatedNews, date: news.date }),
              time: updatedNews.time || news.time,
              keywords: updatedNews.keyword || updatedNews.keywords || news.keywords || [],
              intro: updatedNews.introduction || updatedNews.intro || news.intro,
              hookContent: updatedNews.hook || news.hookContent,
              summarizedContent: updatedNews.summary || news.summarizedContent,
              originalSources: updatedNews.source 
                ? [{ name: updatedNews.source, url: updatedNews.source }]
                : (updatedNews.originalSources || news.originalSources || []),
            };
            setNews(mappedNews);
          } catch (e) {
            setNews({ ...news, status: 'pending' });
          }
        } else {
          setNews({ ...news, status: 'pending' });
          // Refetch to get updated data from server
          const refreshResponse = await fetch(`${API_ENDPOINTS.NEWS_GET}/${encodeURIComponent(String(newsId))}`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'irc-lang': language === 'th' ? 'th' : 'en',
            },
            credentials: 'include',
          });
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const mappedNews: NewsDetailData = {
              id: refreshData.id,
              title: refreshData.title || '',
              category: refreshData.category || '',
              status: refreshData.status || 'pending',
              date: extractDateFromItem(refreshData),
              time: refreshData.time || '',
              keywords: refreshData.keyword || refreshData.keywords || [],
              intro: refreshData.introduction || refreshData.intro || '',
              hookContent: refreshData.hook || '',
              summarizedContent: refreshData.summary || '',
              originalSources: refreshData.source 
                ? [{ name: refreshData.source, url: refreshData.source }]
                : (refreshData.originalSources || []),
            };
            setNews(mappedNews);
          }
        }
        toast.success(t('newsDetail.cancelVerifySuccess'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to cancel verification:', response.status, errorData);
        toast.error(errorData.message || t('newsDetail.loadError'));
      }
    } catch (error) {
      console.error('Error canceling verification:', error);
      toast.error(t('newsDetail.serverError'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelReject = async () => {
    if (!news) return;

    try {
      setIsUpdatingStatus(true);
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
        // Check if response has content before parsing
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        if (text && contentType?.includes('application/json')) {
          try {
            const updatedNews = JSON.parse(text);
            const mappedNews: NewsDetailData = {
              id: updatedNews.id,
              title: updatedNews.title || news.title,
              category: updatedNews.category || news.category,
              status: updatedNews.status || 'pending',
              date: extractDateFromItem(updatedNews.date ? updatedNews : { ...updatedNews, date: news.date }),
              time: updatedNews.time || news.time,
              keywords: updatedNews.keyword || updatedNews.keywords || news.keywords || [],
              intro: updatedNews.introduction || updatedNews.intro || news.intro,
              hookContent: updatedNews.hook || news.hookContent,
              summarizedContent: updatedNews.summary || news.summarizedContent,
              originalSources: updatedNews.source 
                ? [{ name: updatedNews.source, url: updatedNews.source }]
                : (updatedNews.originalSources || news.originalSources || []),
            };
            setNews(mappedNews);
          } catch (e) {
            setNews({ ...news, status: 'pending' });
          }
        } else {
          setNews({ ...news, status: 'pending' });
          // Refetch to get updated data from server
          const refreshResponse = await fetch(`${API_ENDPOINTS.NEWS_GET}/${encodeURIComponent(String(newsId))}`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'irc-lang': language === 'th' ? 'th' : 'en',
            },
            credentials: 'include',
          });
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const mappedNews: NewsDetailData = {
              id: refreshData.id,
              title: refreshData.title || news.title,
              category: refreshData.category || news.category,
              status: refreshData.status || 'pending',
              date: extractDateFromItem(refreshData.date ? refreshData : { ...refreshData, date: news.date }),
              time: refreshData.time || news.time,
              keywords: refreshData.keyword || refreshData.keywords || news.keywords || [],
              intro: refreshData.introduction || refreshData.intro || news.intro,
              hookContent: refreshData.hook || news.hookContent,
              summarizedContent: refreshData.summary || news.summarizedContent,
              originalSources: refreshData.source 
                ? [{ name: refreshData.source, url: refreshData.source }]
                : (refreshData.originalSources || news.originalSources || []),
            };
            setNews(mappedNews);
          }
        }
        toast.success(t('newsDetail.cancelRejectSuccess'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to cancel rejection:', response.status, errorData);
        toast.error(errorData.message || t('newsDetail.loadError'));
      }
    } catch (error) {
      console.error('Error canceling rejection:', error);
      toast.error(t('newsDetail.serverError'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Translation function
  const translateText = (text: string) => {
    if (!isTranslated) return text;
    
    // Basic Thai translations
    const translations: Record<string, string> = {
      "Technology": "เทคโนโลยี",
      "Environment": "สิ่งแวดล้อม",
      "Published": "เผยแพร่แล้ว",
      "Verified": "ยืนยันแล้ว",
      "Pending": "รอดำเนินการ",
      "Rejected": "ปฏิเสธแล้ว",
      "Original Sources": "แหล่งข้อมูลต้นฉบับ",
      "Keywords": "คำสำคัญ",
      "Article Status": "สถานะบทความ",
      "Status": "สถานะ"
    };
    
    return translations[text] || text;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t('news.published')}
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            {t('news.verified')}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {t('news.pending')}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t('news.rejected')}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-center h-96">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{t('newsDetail.notFound')}</p>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('newsDetail.back')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('newsDetail.back')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleTranslate}
            className="gap-2 border-gray-300 hover:bg-gray-50"
          >
            <Globe className="w-4 h-4" />
            {isTranslated ? "English" : "ไทย"}
          </Button>
        </div>

        <Card className="border border-border shadow-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {translateText(news.category)}
              </Badge>
              {getStatusBadge(news.status)}
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
              {translateText(news.title)}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className={news.date === "N/A" ? "text-gray-400 italic" : ""}>
                  {news.date}
                  {news.time && news.date !== "N/A" && ` at ${news.time}`}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border border-border shadow-sm rounded-xl">
              <CardContent className="p-8 space-y-6">
                <div>
                  <p className="text-foreground leading-relaxed">
                    {news.intro}
                  </p>
                </div>

                {news.hookContent && (
                  <>
                    <Separator />
                    <div>
                      <div
                        className="prose prose-gray max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground"
                        dangerouslySetInnerHTML={{
                          __html: news.hookContent,
                        }}
                      />
                    </div>
                  </>
                )}

                {news.summarizedContent && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-foreground leading-relaxed">
                        {news.summarizedContent}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground">
                  {t('newsDetail.originalSources')}
                </h3>
              </CardHeader>
              <CardContent className="overflow-hidden">
                {news.originalSources && news.originalSources.length > 0 ? (
                  <div className="space-y-3">
                    {news.originalSources.map((source, index, sources) => (
                      <div key={index} className="overflow-hidden">
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent gap-1.5 text-left w-full justify-start min-w-0"
                          onClick={() =>
                            window.open(source.url, "_blank")
                          }
                        >
                          <span className="break-all break-words overflow-hidden text-ellipsis line-clamp-2 min-w-0 flex-1">
                            {source.name || source.url}
                          </span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0 ml-auto" />
                        </Button>
                        {index < sources.length - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('newsDetail.noSources')}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  {t('newsDetail.keywords')}
                </h3>
              </CardHeader>
              <CardContent>
                {news.keywords && news.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {news.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('newsDetail.noKeywords')}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground">
                  {t('newsDetail.articleStatus')}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t('news.status')}
                  </span>
                  <span className="font-medium text-foreground capitalize">
                    {t(`news.${news.status}`)}
                  </span>
                </div>
                
                {/* Action buttons based on status */}
                {news.status === 'pending' && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="default"
                        onClick={handleVerifyClick}
                        disabled={isUpdatingStatus}
                        className="gap-2 bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        <Check className="w-4 h-4" />
                        {t('newsDetail.verify')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReject}
                        disabled={isUpdatingStatus}
                        className="gap-2 border-red-300 hover:bg-red-50 text-red-700 w-full"
                      >
                        <X className="w-4 h-4" />
                        {t('newsDetail.reject')}
                      </Button>
                    </div>
                  </>
                )}
                
                {news.status === 'verified' && (
                  <>
                    <Separator />
                    <Button
                      variant="outline"
                      onClick={handleCancelVerify}
                      disabled={isUpdatingStatus}
                      className="gap-2 border-orange-300 hover:bg-orange-50 text-orange-700 w-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('newsDetail.cancelVerify')}
                    </Button>
                  </>
                )}
                
                {news.status === 'rejected' && (
                  <>
                    <Separator />
                    <Button
                      variant="outline"
                      onClick={handleCancelReject}
                      disabled={isUpdatingStatus}
                      className="gap-2 border-orange-300 hover:bg-orange-50 text-orange-700 w-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('newsDetail.cancelReject')}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verify Confirmation Modal */}
        <VerifyConfirmationModal
          open={showVerifyConfirm}
          onOpenChange={setShowVerifyConfirm}
          onConfirm={handleVerifyConfirm}
        />
      </div>
    </div>
  );
}


