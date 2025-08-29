const categoryData = [
  { name: "Technology", count: 342, color: "bg-blue-500" },
  { name: "Politics", count: 289, color: "bg-green-500" },
  { name: "Business", count: 156, color: "bg-yellow-500" },
  { name: "Sports", count: 134, color: "bg-red-500" },
  { name: "Entertainment", count: 98, color: "bg-purple-500" },
  { name: "Health", count: 87, color: "bg-pink-500" },
  { name: "Environment", count: 76, color: "bg-indigo-500" },
  { name: "Science", count: 65, color: "bg-teal-500" }
];

export function CategoryDistribution() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-foreground mb-6">Category Distribution</h2>
      
      <div className="space-y-3">
        {categoryData.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 group cursor-pointer hover:-translate-y-0.5 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${category.color} group-hover:scale-125 transition-transform duration-200`} />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">{category.name}</span>
            </div>
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg group-hover:scale-105 transition-all duration-200">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}