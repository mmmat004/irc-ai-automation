import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

export function CategoriesHeader({ onAddCategory }: CategoriesHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
      </div>
      <Button
        onClick={onAddCategory}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Category
      </Button>
    </div>
  );
}