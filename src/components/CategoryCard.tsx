import { useState } from "react";
import {
  Edit2,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Switch } from "./ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface Category {
  id: number;
  name: string;
  color: string;
  description: string;
  keywords: string[];
  articleCount: number;
  weeklyGrowth: number;
  accuracy: number;
  isActive: boolean;
}

interface CategoryCardProps {
  category: Category;
  onToggleActive: (categoryId: number) => void;
  onEdit: (categoryId: number) => void;
}

export function CategoryCard({
  category,
  onToggleActive,
  onEdit,
}: CategoryCardProps) {
  const [showKeywords, setShowKeywords] = useState(false);

  const isPositiveGrowth = category.weeklyGrowth >= 0;

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h3 className="font-semibold text-gray-900">
              {category.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {category.isActive ? (
              <Eye className="w-4 h-4 text-green-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
            <Switch
              checked={category.isActive}
              onCheckedChange={() =>
                onToggleActive(category.id)
              }
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {category.description}
        </p>
      </CardHeader>

      <CardContent className="py-3">
        {/* Performance Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Articles
            </span>
            <span className="font-medium text-gray-900">
              {category.articleCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Keywords Section */}
        <Collapsible
          open={showKeywords}
          onOpenChange={setShowKeywords}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-sm border-gray-300 hover:bg-gray-50"
            >
              <span>Keywords ({category.keywords.length})</span>
              <span className="text-gray-400">
                {showKeywords ? "−" : "+"}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex flex-wrap gap-1">
                {category.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-white border border-gray-200 text-gray-700"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          onClick={() => onEdit(category.id)}
          variant="outline"
          className="w-full gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Edit2 className="w-4 h-4" />
          Edit Category
        </Button>
      </CardFooter>
    </Card>
  );
}