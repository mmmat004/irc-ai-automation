import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

export function NewsHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('newsHeader.title')}</h1>
    
    </div>
  );
}