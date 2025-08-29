import { TrendingUp, Target, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const statsData = [
  {
    title: "Total Categories",
    value: "8",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Active Categories", 
    value: "7",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Total Articles",
    value: "15,847",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
];

export function CategoryStats() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}