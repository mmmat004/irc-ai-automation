import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <div className="flex items-center">
        <Home className="w-4 h-4" />
        <span className="ml-1">iReadCustomer</span>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />
          <span 
            className={`transition-colors hover:text-foreground ${
              item.isActive 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground cursor-pointer'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}