import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { CategoryCard } from "./CategoryCard";
import { AddCategoryModal } from "./AddCategoryModal";

interface CategoryData {
  id: number;
  name: string;
  color: string;
  description: string;
  keywords: string[];
  articleCount: number;
  isActive: boolean;
}

const categoriesData: CategoryData[] = [
  {
    id: 1,
    name: "Business",
    color: "#10b981",
    description: "Corporate news, market analysis, business strategy",
    keywords: ["business", "corporate", "market", "strategy", "revenue", "company", "enterprise"],
    articleCount: 2156,
    isActive: true
  },
  {
    id: 2,
    name: "Data",
    color: "#3b82f6",
    description: "Data science, analytics, big data, data engineering",
    keywords: ["data", "analytics", "database", "data science", "big data", "statistics", "metrics"],
    articleCount: 1834,
    isActive: true
  },
  {
    id: 3,
    name: "AI",
    color: "#8b5cf6",
    description: "Artificial intelligence, machine learning, neural networks",
    keywords: ["AI", "artificial intelligence", "machine learning", "neural networks", "deep learning", "automation"],
    articleCount: 2947,
    isActive: true
  },
  {
    id: 4,
    name: "Technology",
    color: "#06b6d4",
    description: "Software, hardware, innovation, tech infrastructure",
    keywords: ["technology", "software", "hardware", "tech", "innovation", "development", "programming"],
    articleCount: 2387,
    isActive: true
  },
  {
    id: 5,
    name: "Startup",
    color: "#f59e0b",
    description: "Entrepreneurship, funding, startup ecosystem, venture capital",
    keywords: ["startup", "entrepreneur", "funding", "venture capital", "seed", "series A", "investment"],
    articleCount: 1567,
    isActive: true
  },
  {
    id: 6,
    name: "Marketing",
    color: "#ec4899",
    description: "Digital marketing, advertising, brand strategy, growth",
    keywords: ["marketing", "advertising", "brand", "growth", "digital marketing", "campaign", "promotion"],
    articleCount: 1298,
    isActive: true
  },
  {
    id: 7,
    name: "Digital Transform",
    color: "#84cc16",
    description: "Digital transformation, modernization, cloud adoption",
    keywords: ["digital transformation", "modernization", "cloud", "digitalization", "automation", "innovation"],
    articleCount: 987,
    isActive: true
  },
  {
    id: 8,
    name: "Economic",
    color: "#ef4444",
    description: "Economic trends, policy, global economy, indicators",
    keywords: ["economic", "economy", "GDP", "inflation", "policy", "growth", "recession"],
    articleCount: 1734,
    isActive: true
  },
  {
    id: 9,
    name: "Finance",
    color: "#6366f1",
    description: "Financial markets, banking, fintech, investments",
    keywords: ["finance", "banking", "fintech", "investment", "money", "financial", "markets"],
    articleCount: 1643,
    isActive: true
  }
];

interface CategoryCardsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
}

export function CategoryCards({ 
  searchQuery, 
  onSearchChange, 
  isAddModalOpen, 
  onCloseAddModal 
}: CategoryCardsProps) {
  const [categories, setCategories] = useState<CategoryData[]>(categoriesData);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleToggleActive = (categoryId: number) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const handleEdit = (categoryId: number) => {
    console.log("Editing category", categoryId);
    // Handle edit functionality
  };

  const handleAddCategory = (newCategory: any) => {
    const category = {
      id: categories.length + 1,
      ...newCategory,
      articleCount: 0,
      weeklyGrowth: 0,
      accuracy: 0,
      isActive: true
    };
    setCategories(prev => [...prev, category]);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Category Management</h2>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search categories or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
                      <CategoryCard
              key={category.id}
              category={category}
              onToggleActive={handleToggleActive}
              onEdit={handleEdit}
            />
        ))}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}