import { useEffect, useState } from "react";
import { Toaster } from "sonner";
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
  const [isExchanging, setIsExchanging] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [previousPage, setPreviousPage] = useState('dashboard');

  useEffect(() => {
    // Initialize auth from storage on first load - v2
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setIsAuthenticated(true);
      // Optional: allow deep-linking via page query even on hard refresh
      const initParams = new URLSearchParams(window.location.search);
      const initialPage = initParams.get('page');
      if (initialPage) {
        setCurrentPage(initialPage as typeof currentPage);
      }
    }

    // Check for OAuth status in URL parameters
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('oauthToken');
    const oauthStatus = params.get('oauthStatus');
    const requestedPage = params.get('page');
    
    // Handle OAuth failure
    if (oauthStatus === 'failed') {
      console.log('OAuth login failed');
      setAuthError('Login failed. Please try again with a valid account.');
      // Clean URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }
    
    // Handle OAuth success
    if (oauthToken) {
      console.log('OAuth token found, using directly...');
      setIsExchanging(true);
      setAuthError(null);
      
      // Use OAuth token directly without exchange (due to CORS issues)
      try {
        localStorage.setItem('auth_token', oauthToken);
        setIsAuthenticated(true);
        setCurrentPage(requestedPage || 'dashboard');
        console.log('Login successful with OAuth token');
      } catch (error) {
        console.error('OAuth error:', error);
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setAuthError('Login failed. Please try again.');
      } finally {
        // Clean URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        setIsExchanging(false);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setSelectedNewsId(null);
    setPreviousPage('dashboard');
    setAuthError(null);
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

  if (isExchanging) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-secondary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">Signing in…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <Login onLogin={handleLogin} authError={authError} />
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