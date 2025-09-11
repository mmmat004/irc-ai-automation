import { StatsCards } from "../components/StatsCards";
import { RecentActivity } from "../components/RecentActivity";

interface DashboardProps {
  onNewsSelect?: (newsId: number) => void;
}

export function Dashboard({ onNewsSelect }: DashboardProps) {
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your news automation system.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Recent Activity Section */}
        <RecentActivity onNewsSelect={onNewsSelect} />
      </div>
    </div>
  );
}