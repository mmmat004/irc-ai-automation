import { 
  Home, 
  FileText, 
  CheckCircle, 
  Tag, 
  Workflow, 
  User,
  LogOut,
  Circle
} from "lucide-react";
import logoImage from 'figma:asset/7eabaf731540bbbc5100f5b51095c282d76f33e9.png';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'news', label: 'News Management', icon: FileText },
    { id: 'verification', label: 'Verification Queue', icon: CheckCircle },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'workflows', label: 'n8n Workflows', icon: Workflow },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="iReadCustomer" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-sidebar-foreground">iReadCustomer</h1>
            <p className="text-xs text-sidebar-foreground/70">News automation</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive 
                      ? 'text-sidebar-primary-foreground' 
                      : 'text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border">
        
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-sidebar-foreground hover:bg-red-50 hover:text-red-600 group"
        >
          <LogOut className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-red-600" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}