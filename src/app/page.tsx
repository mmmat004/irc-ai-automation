'use client';

import { useState, useEffect } from "react";
// global styles are imported via app/layout.tsx
import { Toaster } from "../components/ui/sonner";
import { Sidebar } from "../components/Sidebar";
import { Dashboard } from "../views/Dashboard";
import { NewsManagement } from "../views/NewsManagement";
import { VerificationQueue } from "../views/VerificationQueue";
import { WorkflowDashboard } from "../views/WorkflowDashboard";
import { CategoriesManagement } from "../views/CategoriesManagement";
import { Profile } from "../views/Profile";
import { Login } from "../views/Login";
import { NewsDetail } from "../views/NewsDetail";
import { API_ENDPOINTS } from "../config/api";
import { LanguageProvider } from "../contexts/LanguageContext";

export const dynamic = 'force-dynamic';

function HomePageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  // Initialize currentPage from URL params or localStorage, fallback to dashboard
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const pageParam = searchParams.get('page');
      const newsIdParam = searchParams.get('newsId');
      // If newsId exists in URL, automatically set page to news-detail
      if (newsIdParam && !pageParam) {
        return 'news-detail';
      }
      if (pageParam) {
        // If page is dashboard, ensure we don't have news detail state
        if (pageParam === 'dashboard') {
          return 'dashboard';
        }
        return pageParam;
      }
      const savedPage = localStorage.getItem('currentPage');
      // If saved page is dashboard, always use dashboard
      if (savedPage === 'dashboard') {
        return 'dashboard';
      }
      // If saved page is news-detail but no newsId, fallback to dashboard
      if (savedPage === 'news-detail' && !localStorage.getItem('selectedNewsId')) {
        return 'dashboard';
      }
      if (savedPage) return savedPage;
    }
    return 'dashboard';
  });
  const [authError, setAuthError] = useState<string | null>(null);
  // Initialize selectedNewsId from URL params or localStorage
  const [selectedNewsId, setSelectedNewsId] = useState<string | number | null>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const pageParam = searchParams.get('page');
      const newsIdParam = searchParams.get('newsId');
      // If page is explicitly dashboard, don't restore newsId
      if (pageParam === 'dashboard') {
        return null;
      }
      if (newsIdParam) return newsIdParam;
      const savedPage = localStorage.getItem('currentPage');
      // If saved page is dashboard, don't restore newsId
      if (savedPage === 'dashboard') {
        return null;
      }
      const savedNewsId = localStorage.getItem('selectedNewsId');
      if (savedNewsId) return savedNewsId;
    }
    return null;
  });
  const [previousPage, setPreviousPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPreviousPage = localStorage.getItem('previousPage');
      return savedPreviousPage || 'dashboard';
    }
    return 'dashboard';
  });

  // Update URL and localStorage when currentPage changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      const searchParams = new URLSearchParams(window.location.search);
      if (currentPage === 'dashboard') {
        searchParams.delete('page');
      } else {
        searchParams.set('page', currentPage);
      }
      const newUrl = searchParams.toString() 
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      localStorage.setItem('currentPage', currentPage);
    }
  }, [currentPage, isAuthenticated]);

  // Save previousPage to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('previousPage', previousPage);
    }
  }, [previousPage]);

  // Automatically set page to news-detail when selectedNewsId is set
  useEffect(() => {
    if (selectedNewsId) {
      // Only change if not already on news-detail to avoid unnecessary updates
      setCurrentPage(prev => prev === 'news-detail' ? prev : 'news-detail');
    }
  }, [selectedNewsId]);

  // Update URL and localStorage when selectedNewsId changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      const searchParams = new URLSearchParams(window.location.search);
      if (selectedNewsId) {
        searchParams.set('newsId', String(selectedNewsId));
        localStorage.setItem('selectedNewsId', String(selectedNewsId));
      } else {
        searchParams.delete('newsId');
        localStorage.removeItem('selectedNewsId');
      }
      const newUrl = searchParams.toString() 
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [selectedNewsId, isAuthenticated]);

  useEffect(() => {
    // Get URL params directly from window for client-side
    const searchParams = new URLSearchParams(window.location.search);
    
    const checkAuth = async () => {
      // Check for demo mode
      if (process.env.NEXT_PUBLIC_DEMO === 'true') {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // Handle OAuth token from backend redirect
      const oauthToken = searchParams.get('oauthToken');
      const oauthStatus = searchParams.get('oauthStatus');
      
      if (oauthToken) {
        console.log('🔑 OAuth token found in URL:', oauthToken.substring(0, 20) + '...');
        console.log('🔑 OAuth status:', oauthStatus);
        
        try {
          const response = await fetch(API_ENDPOINTS.OAUTH_EXCHANGE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
            body: JSON.stringify({
              oAuthTempToken: oauthToken  // Backend expects this exact field name
            })
          });

          console.log('🔄 Token exchange response status:', response.status);
          console.log('📤 Request body sent:', { oAuthTempToken: oauthToken });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Token exchange successful!', data);
            setIsAuthenticated(true);
            setAuthError(null);
            // Reset to dashboard on successful login
            setCurrentPage('dashboard');
            setSelectedNewsId(null);
            setPreviousPage('dashboard');
            // Clear navigation-related localStorage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('currentPage');
              localStorage.removeItem('selectedNewsId');
              localStorage.removeItem('previousPage');
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Token exchange failed:', errorData);
            console.error('❌ Full error details:', JSON.stringify(errorData, null, 2));
            
            const errorMessage = Array.isArray(errorData.message) 
              ? errorData.message.join(', ')
              : (errorData.message || 'Login failed. Please try again.');
            
            setAuthError(errorMessage);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('❌ Token exchange error:', error);
          setAuthError('Login failed. Please try again.');
          setIsAuthenticated(false);
        } finally {
          setIsChecking(false);
          // Clean up URL
          window.history.replaceState({}, '', '/');
        }
        return;
      }

      // Check for authentication errors from backend redirect
      const errorParam = searchParams.get('error');
      if (errorParam) {
        const errorMessages: Record<string, string> = {
          'access_denied': 'Access denied. Please try again.',
          'invalid_account': 'Invalid account. Please use an authorized account.',
          'unauthorized': 'You are not authorized to access this application.',
        };
        setAuthError(
          errorMessages[errorParam] || decodeURIComponent(errorParam)
        );
        setIsAuthenticated(false);
        setIsChecking(false);
        // Clean up URL
        window.history.replaceState({}, '', '/');
        return;
      }

      // Check authentication with backend (backend sets cookies)
      try {
        console.log('🔍 Checking authentication with:', API_ENDPOINTS.USER_PROFILE);
        console.log('📝 Current cookies:', document.cookie || 'No cookies found');
        
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          credentials: 'include', // Important: sends cookies
        });

        console.log('📡 Auth response status:', response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log('✅ Authentication successful! User:', userData);
          setIsAuthenticated(true);
          setAuthError(null);
          // On successful auth check, ensure we start at dashboard if no valid news detail state
          const savedPage = localStorage.getItem('currentPage');
          const savedNewsId = localStorage.getItem('selectedNewsId');
          // Only restore news-detail if both page and newsId are present
          if (savedPage === 'news-detail' && savedNewsId) {
            // Keep the saved state
          } else {
            // Reset to dashboard if invalid state
            setCurrentPage('dashboard');
            setSelectedNewsId(null);
            setPreviousPage('dashboard');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('currentPage');
              localStorage.removeItem('selectedNewsId');
              localStorage.setItem('previousPage', 'dashboard');
            }
          }
        } else if (response.status === 401) {
          // Unauthorized - cookies not present or invalid
          console.warn('❌ Authentication failed: No valid session cookies');
          console.log('This is normal if you haven\'t logged in yet');
          setIsAuthenticated(false);
        } else {
          console.error('❌ Auth check failed with status:', response.status);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []); // Run once on mount

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const handleLogout = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include', // Send cookies to backend
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setCurrentPage('dashboard');
      setSelectedNewsId(null);
      setPreviousPage('dashboard');
      setAuthError(null);
      // Clear all navigation-related localStorage
      localStorage.removeItem('currentPage');
      localStorage.removeItem('selectedNewsId');
      localStorage.removeItem('previousPage');
      // Redirect to clear any session
      window.location.href = '/';
    }
  };

  const handleNewsSelect = (newsId: string | number) => {
    setPreviousPage(currentPage);
    setSelectedNewsId(newsId);
    setCurrentPage('news-detail');
  };

  const handleBackFromNewsDetail = () => {
    setSelectedNewsId(null);
    setCurrentPage(previousPage);
  };

  // Custom navigation handler that clears news detail state when navigating to dashboard
  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      // Clear news detail state when navigating to dashboard
      setSelectedNewsId(null);
      setPreviousPage('dashboard');
      // Clear localStorage for news detail
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedNewsId');
        localStorage.setItem('previousPage', 'dashboard');
      }
    }
    setCurrentPage(page);
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

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
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
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="flex-1 bg-secondary">
        {renderCurrentPage()}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}