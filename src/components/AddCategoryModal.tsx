import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "sonner";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: any) => void;
  onCategoryAdded?: () => void;
}

const colorOptions = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
  "#ef4444", "#06b6d4", "#ec4899", "#84cc16",
  "#f97316", "#6366f1", "#14b8a6", "#f43f5e"
];

export function AddCategoryModal({ isOpen, onClose, onAddCategory, onCategoryAdded }: AddCategoryModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    nameThai: "",
    description: "",
    descriptionThai: "",
    color: colorOptions[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error(t('category.name') + ' is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORY_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nameEn: formData.name.trim(),
          nameTh: formData.nameThai.trim() || formData.name.trim(),
          descriptionEn: formData.description.trim(),
          descriptionTh: formData.descriptionThai.trim() || formData.description.trim(),
          colorCode: formData.color, // API expects colorCode instead of color
          isVisible: true, // Default to visible when creating
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add category: ${response.status}`);
      }

      const data = await response.json();
      toast.success(t('category.add') + ' ' + t('common.success'));
      
      // Call the callback to refresh categories
      if (onCategoryAdded) {
        onCategoryAdded();
      }
      
      // Also call the old callback for backward compatibility
      onAddCategory({
        ...formData,
        id: data.id || data.categoryId || data._id,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error instanceof Error ? error.message : t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      nameThai: "",
      description: "",
      descriptionThai: "",
      color: colorOptions[0]
    });
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('category.addNew')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name (English) */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('category.name')} (English)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('category.namePlaceholder')}
              className="border-gray-300"
              required
            />
          </div>

          {/* Category Name (Thai) */}
          <div className="space-y-2">
            <Label htmlFor="nameThai">{t('category.name')} (ไทย)</Label>
            <Input
              id="nameThai"
              value={formData.nameThai}
              onChange={(e) => setFormData(prev => ({ ...prev, nameThai: e.target.value }))}
              placeholder="กรอกชื่อหมวดหมู่ (ภาษาไทย)"
              className="border-gray-300"
            />
          </div>

          {/* Description (English) */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('category.description')} (English)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('category.descriptionPlaceholder')}
              className="min-h-[80px] resize-none border-gray-300"
            />
          </div>

          {/* Description (Thai) */}
          <div className="space-y-2">
            <Label htmlFor="descriptionThai">{t('category.description')} (ไทย)</Label>
            <Textarea
              id="descriptionThai"
              value={formData.descriptionThai}
              onChange={(e) => setFormData(prev => ({ ...prev, descriptionThai: e.target.value }))}
              placeholder="อธิบายว่าหมวดหมู่นี้ครอบคลุมอะไรสำหรับการจัดประเภท AI (ภาษาไทย)"
              className="min-h-[80px] resize-none border-gray-300"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>{t('category.color')}</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-300"
            >
              {t('category.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('category.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}