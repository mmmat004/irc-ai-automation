import { StatsCards } from "../components/StatsCards";
import { RecentActivity } from "../components/RecentActivity";
import { useLanguage } from "../contexts/LanguageContext";

interface DashboardProps {
  onNewsSelect?: (newsId: string | number) => void;
}

export function Dashboard({ onNewsSelect }: DashboardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('dashboard.description')}
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


