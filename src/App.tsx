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
    
    console.log('OAuth params:', { oauthToken, oauthStatus, requestedPage });
    
    // Handle OAuth failure - check for various failure indicators
    if (oauthStatus === 'failed' || oauthStatus === 'error' || oauthStatus === 'denied') {
      console.log('OAuth login failed with status:', oauthStatus);
      setAuthError('Login failed. Please try again with a valid account.');
      setIsAuthenticated(false);
      // Clean URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }
    
    // Handle case where OAuth returns but no token (potential failure)
    if (oauthStatus && oauthStatus !== 'success' && !oauthToken) {
      console.log('OAuth completed but no token received, status:', oauthStatus);
      setAuthError('Login failed. Please try again.');
      setIsAuthenticated(false);
      // Clean URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }
    
    // Handle case where there's an error parameter (common OAuth failure pattern)
    const errorParam = params.get('error');
    if (errorParam) {
      console.log('OAuth error parameter found:', errorParam);
      setAuthError(`Login failed: ${errorParam}. Please try again.`);
      setIsAuthenticated(false);
      // Clean URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      return;
    }
    
    // Handle OAuth success
    if (oauthToken) {
      console.log('OAuth token found, using directly due to CORS issues');
      console.log('Token length:', oauthToken.length);
      
      setAuthError(null);
      
      // Use OAuth token directly (CORS workaround)
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
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Test function to verify API endpoint (for debugging)
  const testApiEndpoint = async () => {
    const testToken = 'test-token-123';
    console.log('🧪 Testing API endpoint...');
    
    try {
      const response = await fetch('https://irc-be-production.up.railway.app/auth/oauth-exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oAuthTempToken: testToken
        })
      });
      console.log('🧪 API test response status:', response.status);
      console.log('🧪 API test response:', await response.text());
    } catch (error) {
      console.log('🧪 API test error:', error);
    }
  };

  // Uncomment the line below to test API endpoint
  // testApiEndpoint();

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