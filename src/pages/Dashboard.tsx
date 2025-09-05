import { StatsCards } from "../components/StatsCards";
import { RecentActivity } from "../components/RecentActivity";
import { useUser } from "../contexts/UserContext";

interface DashboardProps {
  onNewsSelect?: (newsId: number) => void;
}

export function Dashboard({ onNewsSelect }: DashboardProps) {
  const { user } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            {getGreeting()}{user?.given_name ? `, ${user.given_name}` : ''}! Here's what's happening with your news automation system.
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