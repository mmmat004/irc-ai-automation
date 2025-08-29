const recentNewsData = [
  {
    id: 1,
    title: "Breaking: Tech Giants Announce New AI Partnership",
    category: "Technology",
    status: "published",
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    category: "Environment",
    status: "verified",
    time: "4 hours ago"
  },
  {
    id: 3,
    title: "Market Update: Stocks Rise on Positive Economic Data",
    category: "Finance",
    status: "pending",
    time: "6 hours ago"
  },
  {
    id: 4,
    title: "Sports: Championship Finals Set for This Weekend",
    category: "Sports",
    status: "verified",
    time: "8 hours ago"
  }
];

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
  onNewsSelect?: (newsId: number) => void;
}

export function RecentNews({ onNewsSelect }: RecentNewsProps) {
  const handleNewsClick = (newsId: number) => {
    if (onNewsSelect) {
      onNewsSelect(newsId);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-foreground mb-6">Recent News</h2>
      
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
                <span className="text-sm text-muted-foreground">{news.time}</span>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 group-hover:scale-105 ${getStatusBadge(news.status)}`}>
              {news.status.charAt(0).toUpperCase() + news.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}