import { useState } from "react";
import { Toaster } from "sonner@2.0.3";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { NewsManagement } from "./pages/NewsManagement";
import { VerificationQueue } from "./pages/VerificationQueue";
import { WorkflowDashboard } from "./pages/WorkflowDashboard";
import { CategoriesManagement } from "./pages/CategoriesManagement";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { NewsDetail } from "./pages/NewsDetail";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [previousPage, setPreviousPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setSelectedNewsId(null);
    setPreviousPage('dashboard');
  };

  const handleNewsSelect = (newsId: number) => {
    setPreviousPage(currentPage);
    setSelectedNewsId(newsId);
    setCurrentPage('news-detail');
  };

  const handleBackFromNewsDetail = () => {
    setSelectedNewsId(null);
    setCurrentPage(previousPage);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'news':
        return <NewsManagement onNewsSelect={handleNewsSelect} />;
      case 'verification':
        return <VerificationQueue onNewsSelect={handleNewsSelect} />;
      case 'news-detail':
        return selectedNewsId ? (
          <NewsDetail 
            newsId={selectedNewsId} 
            onBack={handleBackFromNewsDetail}
          />
        ) : (
          <Dashboard onNewsSelect={handleNewsSelect} />
        );
      case 'workflows':
        return <WorkflowDashboard />;
      case 'categories':
        return <CategoriesManagement />;
      case 'profile':
        return <Profile />;
      case 'dashboard':
      default:
        return <Dashboard onNewsSelect={handleNewsSelect} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1 bg-secondary">
        {renderCurrentPage()}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}