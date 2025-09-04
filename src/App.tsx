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

    // Detect temporary oauth token in URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('oauthToken') || params.get('token') || params.get('access_token');
    const requestedPage = params.get('page');
    if (tokenParam) {
      setIsExchanging(true);
      setAuthError(null);
      // Use CORS proxy to bypass CORS restrictions
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
      ];
      
      const targetUrl = encodeURIComponent('https://irc-be-production.up.railway.app/auth/oauth-exchange-token');
      const proxyUrl = proxies[0]; // Start with first proxy
      
      fetch(proxyUrl + targetUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ oAuthTempToken: tokenParam }),
      })
        .then(async (res) => {
          console.log('Token exchange response:', res.status, res.statusText);
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Token exchange failed:', errorData);
            throw new Error(errorData.message?.[0] || 'Authentication failed');
          }
          const data = await res.json();
          console.log('Token exchange data:', data);
          const finalToken = data?.token || data?.accessToken || tokenParam;
          localStorage.setItem('auth_token', finalToken);
          console.log('Token saved:', finalToken);
          setIsAuthenticated(true);
          setCurrentPage(requestedPage || 'dashboard');
        })
        .catch((error) => {
          console.error('OAuth exchange error:', error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setAuthError(error.message || 'Login failed. Please try again.');
        })
        .finally(() => {
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