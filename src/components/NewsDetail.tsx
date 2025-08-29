import {
  ArrowLeft,
  Clock,
  Hash,
  ExternalLink,
  Share2,
  Bookmark,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

interface NewsDetailProps {
  newsId: number;
  onBack: () => void;
}

// Updated mock data for AI-generated content structure
const getNewsDetail = (id: number) => {
  const newsDetails = {
    1: {
      id: 1,
      title:
        "Breaking: Tech Giants Announce New AI Partnership",
      category: "Technology",
      status: "published",
      date: "2024-01-15",
      time: "14:30",
      keywords: [
        "AI",
        "Partnership",
        "Technology",
        "Innovation",
        "Machine Learning",
      ],
      intro:
        "In a groundbreaking announcement that could reshape the artificial intelligence landscape, several major technology companies have formed an unprecedented partnership to accelerate AI development and ensure responsible deployment of advanced AI systems.",
      hookContent: `
        <p>The partnership, announced at a joint press conference in San Francisco, brings together industry leaders including Microsoft, Google, OpenAI, and Meta, marking the first time these competitors have collaborated on such a scale.</p>
        
        <h3>Key Partnership Objectives</h3>
        <p>The collaboration aims to address three critical areas:</p>
        <ul>
          <li><strong>Safety Standards:</strong> Developing comprehensive safety protocols for AI systems</li>
          <li><strong>Ethical Guidelines:</strong> Establishing industry-wide ethical frameworks</li>
          <li><strong>Innovation Acceleration:</strong> Pooling resources for breakthrough research</li>
        </ul>
        
        <p>"This partnership represents a pivotal moment in AI development," said Dr. Emily Chen, AI Ethics researcher at Stanford University. "When industry leaders come together like this, it signals a maturity in the field that prioritizes responsible innovation."</p>
        
        <h3>Industry Impact</h3>
        <p>The announcement has already sent ripples through the tech industry, with stock prices of participating companies seeing immediate positive reactions. Industry analysts predict this collaboration could accelerate AI development timelines by 2-3 years while ensuring better safety standards.</p>
        
        <p>The partnership will establish a joint research facility in Silicon Valley, with plans to invest $2.5 billion over the next five years. This facility will focus on developing next-generation AI systems while maintaining strict ethical oversight.</p>
      `,
      summarizedContent:
        "As the AI landscape continues to evolve rapidly, this partnership sets a new precedent for industry collaboration and responsible innovation. The companies plan to release their first joint research findings by the end of 2024, marking a significant step forward in ethical AI development.",
      originalSources: [
        {
          name: "TechCrunch",
          url: "https://techcrunch.com/ai-partnership-announcement",
        },
        {
          name: "The Verge",
          url: "https://theverge.com/tech-giants-ai-collaboration",
        },
        {
          name: "Wired",
          url: "https://wired.com/ai-industry-partnership",
        },
        {
          name: "Bloomberg Technology",
          url: "https://bloomberg.com/tech-ai-partnership",
        },
      ],
    },
    2: {
      id: 2,
      title: "Global Climate Summit Reaches Historic Agreement",
      category: "Environment",
      status: "verified",
      date: "2024-01-15",
      time: "12:15",
      keywords: [
        "Climate Change",
        "Environment",
        "Summit",
        "Global Agreement",
        "Sustainability",
      ],
      intro:
        "After two weeks of intense negotiations, the Global Climate Summit has concluded with a historic agreement that commits 195 countries to unprecedented climate action, marking the most significant environmental accord since the Paris Agreement.",
      hookContent: `
        <p>The agreement, dubbed the "Global Climate Resilience Pact," establishes binding commitments for carbon neutrality and introduces innovative financing mechanisms for developing nations to transition to clean energy.</p>
        
        <h3>Key Agreement Highlights</h3>
        <p>The pact includes several groundbreaking provisions:</p>
        <ul>
          <li><strong>Carbon Neutrality:</strong> All signatory nations commit to carbon neutrality by 2045</li>
          <li><strong>Clean Energy Fund:</strong> $500 billion global fund for renewable energy transition</li>
          <li><strong>Forest Protection:</strong> Legally binding protection for 30% of global forests</li>
          <li><strong>Ocean Conservation:</strong> New international marine protected areas</li>
        </ul>
        
        <p>UN Secretary-General António Guterres called the agreement "a turning point in humanity's fight against climate change," emphasizing the legally binding nature of the commitments.</p>
        
        <h3>Implementation Timeline</h3>
        <p>The agreement will be implemented in phases, with immediate actions required within the first 100 days. Countries must submit detailed implementation plans by March 2024, with regular progress reviews every six months.</p>
      `,
      summarizedContent:
        "Environmental groups have cautiously welcomed the agreement, though some critics argue the timeline may still be too conservative given the urgency of the climate crisis. The pact represents a significant step forward in global climate cooperation.",
      originalSources: [
        {
          name: "Reuters",
          url: "https://reuters.com/climate-summit-agreement",
        },
        {
          name: "BBC News",
          url: "https://bbc.com/climate-accord-2024",
        },
        {
          name: "CNN",
          url: "https://cnn.com/climate-summit-historic-deal",
        },
        {
          name: "The Guardian",
          url: "https://theguardian.com/climate-agreement",
        },
      ],
    },
  };

  return (
    newsDetails[id as keyof typeof newsDetails] ||
    newsDetails[1]
  );
};

export function NewsDetail({
  newsId,
  onBack,
}: NewsDetailProps) {
  const news = getNewsDetail(newsId);

  const handleShare = () => {
    toast("Link copied to clipboard!");
  };

  const handleBookmark = () => {
    toast("Article bookmarked!");
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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Article Header */}
        <Card className="border border-border shadow-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {news.category}
              </Badge>
              {getStatusBadge(news.status)}
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
              {news.title}
            </h1>

            {/* Article Meta Information - Removed views and reading time */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {news.date} at {news.time}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Consolidated into single card */}
          <div className="lg:col-span-2">
            <Card className="border border-border shadow-sm rounded-xl">
              <CardContent className="p-8 space-y-6">
                {/* Introduction */}
                <div>
                  <p className="text-foreground leading-relaxed">
                    {news.intro}
                  </p>
                </div>

                <Separator />

                {/* Main Content */}
                <div>
                  <div
                    className="prose prose-gray max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: news.hookContent,
                    }}
                  />
                </div>

                <Separator />

                {/* Summary */}
                <div>
                  <p className="text-foreground leading-relaxed">
                    {news.summarizedContent}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Original Sources */}
            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground">
                  Original Sources
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {news.originalSources.map((source, index) => (
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
                      {index <
                        news.originalSources.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Keywords
                </h3>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Article Stats - Removed views and reading time, kept only status */}
            <Card className="border border-border shadow-sm rounded-xl">
              <CardHeader>
                <h3 className="font-semibold text-foreground">
                  Article Status
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Status
                  </span>
                  <span className="font-medium text-foreground capitalize">
                    {news.status}
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