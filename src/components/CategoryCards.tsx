import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { CategoryCard } from "./CategoryCard";
import { AddCategoryModal } from "./AddCategoryModal";

const categoriesData = [
  {
    id: 1,
    name: "Technology",
    color: "#3b82f6",
    description: "AI, software, hardware, innovation, digital transformation",
    keywords: ["AI", "machine learning", "software", "hardware", "tech", "digital", "innovation"],
    articleCount: 2847,
    isActive: true
  },
  {
    id: 2,
    name: "Business",
    color: "#10b981",
    description: "Finance, markets, economy, corporate news, startups",
    keywords: ["finance", "market", "economy", "business", "startup", "corporate", "investment"],
    articleCount: 1924,
    isActive: true
  },
  {
    id: 3,
    name: "Health",
    color: "#f59e0b",
    description: "Medical research, healthcare, wellness, public health",
    keywords: ["health", "medical", "healthcare", "wellness", "medicine", "research", "treatment"],
    articleCount: 1356,
    isActive: true
  },
  {
    id: 4,
    name: "Science", 
    color: "#8b5cf6",
    description: "Research, discoveries, climate, space, environment",
    keywords: ["science", "research", "discovery", "climate", "space", "environment", "study"],
    articleCount: 987,
    isActive: true
  },
  {
    id: 5,
    name: "Politics",
    color: "#ef4444",
    description: "Government, policy, elections, international relations",
    keywords: ["politics", "government", "policy", "election", "parliament", "minister", "law"],
    articleCount: 1634,
    isActive: true
  },
  {
    id: 6,
    name: "Sports",
    color: "#06b6d4",
    description: "Athletics, competitions, teams, player news",
    keywords: ["sports", "football", "basketball", "tennis", "athletics", "competition", "team"],
    articleCount: 798,
    isActive: true
  },
  {
    id: 7,
    name: "Entertainment",
    color: "#ec4899",
    description: "Movies, music, celebrities, culture, media",
    keywords: ["entertainment", "movie", "music", "celebrity", "culture", "media", "show"],
    articleCount: 1245,
    isActive: true
  },
  {
    id: 8,
    name: "Education",
    color: "#84cc16",
    description: "Schools, universities, learning, academic research",
    keywords: ["education", "school", "university", "learning", "student", "academic", "research"],
    articleCount: 543,
    isActive: false
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
  const [categories, setCategories] = useState(categoriesData);

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