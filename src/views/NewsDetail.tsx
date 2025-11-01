import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../config/api";

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
  const [news, setNews] = useState<NewsDetailData | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          // Map API response fields to component interface
          const mappedNews: NewsDetailData = {
            id: data.id,
            title: data.title || '',
            category: data.category || '',
            status: data.status || 'pending',
            date: data.date || data.createdAt || new Date().toISOString().split('T')[0],
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
          toast.error('News article not found');
          onBack();
        } else {
          console.error('Failed to fetch news detail:', response.status);
          toast.error('Failed to load news article. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
        toast.error('Cannot connect to server. Check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId, onBack]);

  const handleShare = () => {
    toast("Link copied to clipboard!");
  };

  const handleBookmark = () => {
    toast("Article bookmarked!");
  };

  const handleTranslate = () => {
    setIsTranslated(!isTranslated);
    toast(isTranslated ? "Switched to English" : "Switched to Thai");
  };

  const handleVerify = async () => {
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
          status: 'verified',
        }),
      });

      if (response.ok) {
        const updatedNews = await response.json();
        setNews(updatedNews);
        toast.success('News article verified successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to verify news:', response.status, errorData);
        toast.error(errorData.message || 'Failed to verify news article. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying news:', error);
      toast.error('Cannot connect to server. Check your connection.');
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
        const updatedNews = await response.json();
        setNews(updatedNews);
        toast.success('News article rejected.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to reject news:', response.status, errorData);
        toast.error(errorData.message || 'Failed to reject news article. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting news:', error);
      toast.error('Cannot connect to server. Check your connection.');
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
            Published
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
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
              <p className="text-muted-foreground mb-4">News article not found</p>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
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
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Verify and Reject buttons */}
            {news.status === 'pending' && (
              <>
                <Button
                  variant="default"
                  onClick={handleVerify}
                  disabled={isUpdatingStatus}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4" />
                  Verify
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={isUpdatingStatus}
                  className="gap-2 border-red-300 hover:bg-red-50 text-red-700"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              onClick={handleTranslate}
              className="gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Globe className="w-4 h-4" />
              {isTranslated ? "English" : "ไทย"}
            </Button>
          </div>
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
                <span>
                  {news.date}
                  {news.time && ` at ${news.time}`}
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
                  {translateText("Original Sources")}
                </h3>
              </CardHeader>
              <CardContent>
                {news.originalSources && news.originalSources.length > 0 ? (
                  <div className="space-y-3">
                    {news.originalSources.map((source, index, sources) => (
                      <div key={index}>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent gap-1 text-left w-full justify-start"
                          onClick={() =>
                            window.open(source.url, "_blank")
                          }
                        >
                          {source.name}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        {index < sources.length - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No sources available</p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  {translateText("Keywords")}
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
                  <p className="text-sm text-muted-foreground">No keywords available</p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground">
                  {translateText("Article Status")}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {translateText("Status")}
                  </span>
                  <span className="font-medium text-foreground capitalize">
                    {translateText(news.status)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


