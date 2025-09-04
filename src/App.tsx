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
    
    console.log('URL params:', { oauthToken, oauthStatus, requestedPage });
    
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
    
    // Handle OAuth success
    if (oauthToken) {
      console.log('OAuth token found, exchanging with backend...');
      setIsExchanging(true);
      setAuthError(null);
      
      // Exchange OAuth token with backend using CORS proxy
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
      const targetUrl = 'https://irc-be-production.up.railway.app/auth/oauth-exchange-token';
      
      fetch(proxyUrl + targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oAuthTempToken: oauthToken
        }),
        signal: controller.signal
      })
      .then(response => {
        console.log('Token exchange response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Token exchange data:', data);
        const authToken = data.token || data.accessToken || data.access_token;
        if (authToken) {
          localStorage.setItem('auth_token', authToken);
          setIsAuthenticated(true);
          setCurrentPage(requestedPage || 'dashboard');
          console.log('Login successful with exchanged token');
        } else {
          throw new Error('No token received from backend');
        }
      })
      .catch(error => {
        console.error('OAuth exchange error:', error);
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setAuthError(`Login failed: ${error.message}. Please try again.`);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        // Clean URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        setIsExchanging(false);
      });
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