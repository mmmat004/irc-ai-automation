import { FileText, Clock, TrendingUp, Tag } from "lucide-react";

const statsData = [
  {
    title: "Total News",
    value: "1,247",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Pending Verification",
    value: "23",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Published This Week",
    value: "45",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Categories",
    value: "8",
    icon: Tag,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}