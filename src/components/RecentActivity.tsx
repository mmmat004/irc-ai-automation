import { RecentNews } from "./RecentNews";
import { CategoryDistribution } from "./CategoryDistribution";

interface RecentActivityProps {
  onNewsSelect?: (newsId: number) => void;
}

export function RecentActivity({ onNewsSelect }: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <RecentNews onNewsSelect={onNewsSelect} />
      <CategoryDistribution />
    </div>
  );
}