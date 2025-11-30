import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

export function CategoriesHeader({ onAddCategory }: CategoriesHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('categories.title')}</h1>
      </div>
      <Button
        onClick={onAddCategory}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
      >
        <Plus className="w-4 h-4" />
        {t('categories.add')}
      </Button>
    </div>
  );
}