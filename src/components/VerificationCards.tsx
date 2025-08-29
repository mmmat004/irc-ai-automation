import { useState } from "react";
import { VerificationCard } from "./VerificationCard";
import { toast } from "sonner@2.0.3";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  preview: string;
  sources: string[];
  content: string;
  status?: string;
}

const initialPendingNewsData: NewsItem[] = [
  {
    id: 1,
    title: "Market Update: Stocks Rise on Positive Economic Data",
    category: "Business",
    date: "2024-01-15",
    time: "10:45",
    preview: "Financial markets showed strong performance today as investors responded positively to new economic indicators showing growth in key sectors...",
    sources: [
      "Reuters Business",
      "Financial Times",
      "Bloomberg Markets"
    ],
    content: "Financial markets showed strong performance today as investors responded positively to new economic indicators showing growth in key sectors. The Dow Jones Industrial Average rose 2.3% while the S&P 500 gained 1.8% during morning trading sessions. Analysts attribute the surge to better-than-expected employment figures and consumer confidence data released earlier this week.",
    status: "pending"
  },
  {
    id: 2,
    title: "Healthcare Innovation: New Treatment Shows Promise",
    category: "Health",
    date: "2024-01-15",
    time: "09:20",
    preview: "Researchers at leading medical institutions have announced breakthrough results in clinical trials for a new treatment approach...",
    sources: [
      "Medical Journal Today",
      "Health News Network",
      "Scientific Reports"
    ],
    content: "Researchers at leading medical institutions have announced breakthrough results in clinical trials for a new treatment approach targeting autoimmune disorders. The Phase II trials showed a 78% improvement rate in patient symptoms with minimal side effects reported. The treatment combines existing immunotherapy techniques with novel targeted therapy approaches.",
    status: "pending"
  },
  {
    id: 3,
    title: "Science Discovery: Breakthrough in Quantum Computing",
    category: "Science",
    date: "2024-01-14",
    time: "16:30",
    preview: "Scientists have achieved a major milestone in quantum computing research, demonstrating unprecedented computational capabilities...",
    sources: [
      "Nature Scientific Journal",
      "Quantum Research Institute",
      "Tech Science Daily"
    ],
    content: "Scientists have achieved a major milestone in quantum computing research, demonstrating unprecedented computational capabilities in solving complex mathematical problems. The new quantum processor completed calculations in minutes that would take traditional supercomputers thousands of years to solve.",
    status: "pending"
  },
  {
    id: 4,
    title: "Environmental Study: Ocean Conservation Efforts Show Results",
    category: "Environment",
    date: "2024-01-14",
    time: "14:15",
    preview: "A comprehensive 5-year study reveals significant improvements in marine ecosystem health following international conservation efforts...",
    sources: [
      "Environmental Science Journal",
      "Ocean Conservation Alliance",
      "Marine Biology Reports"
    ],
    content: "A comprehensive 5-year study reveals significant improvements in marine ecosystem health following international conservation efforts. Marine biologists report a 35% increase in coral reef coverage and a 42% recovery in fish population diversity across protected areas in the Pacific Ocean.",
    status: "pending"
  },
  {
    id: 5,
    title: "Technology Update: AI Safety Standards Established",
    category: "Technology",
    date: "2024-01-14",
    time: "11:45",
    preview: "International technology leaders have reached consensus on new safety standards for artificial intelligence development and deployment...",
    sources: [
      "AI Safety Institute",
      "Technology Standards Board",
      "Digital Ethics Review"
    ],
    content: "International technology leaders have reached consensus on new safety standards for artificial intelligence development and deployment. The comprehensive framework addresses ethical considerations, bias prevention, and transparency requirements for AI systems used in critical applications.",
    status: "pending"
  }
];

interface VerificationCardsProps {
  onNewsSelect?: (newsId: number) => void;
}

export function VerificationCards({ onNewsSelect }: VerificationCardsProps) {
  const [newsData, setNewsData] = useState<NewsItem[]>(initialPendingNewsData);

  const handleApprove = (newsId: number, notes: string) => {
    setNewsData(prevData =>
      prevData.map(item =>
        item.id === newsId
          ? { ...item, status: 'approved' }
          : item
      )
    );
    
    const newsItem = newsData.find(item => item.id === newsId);
    if (newsItem) {
      toast.success(`"${newsItem.title}" has been approved successfully!`);
    }
  };

  const handleReject = (newsId: number, notes: string) => {
    setNewsData(prevData =>
      prevData.map(item =>
        item.id === newsId
          ? { ...item, status: 'rejected' }
          : item
      )
    );
    
    const newsItem = newsData.find(item => item.id === newsId);
    if (newsItem) {
      toast.error(`"${newsItem.title}" has been rejected.`);
    }
  };

  // Filter out approved and rejected items to only show pending ones
  const pendingItems = newsData.filter(item => item.status === 'pending');

  return (
    <div className="space-y-6">
      {pendingItems.length > 0 ? (
        pendingItems.map((newsItem) => (
          <VerificationCard 
            key={newsItem.id} 
            newsItem={newsItem} 
            onNewsSelect={onNewsSelect}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))
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