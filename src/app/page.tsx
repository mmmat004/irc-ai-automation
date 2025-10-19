'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { API_ENDPOINTS } from "../config/api";

export const dynamic = 'force-dynamic';

function HomePageContent() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;
    
    const checkAuth = async () => {
      // Check for demo mode
      if (process.env.NEXT_PUBLIC_DEMO === 'true') {
        setIsAuthenticated(true);
        setIsChecking(false);
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
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          credentials: 'include', // Important: sends cookies
        });

        if (response.ok) {
          setIsAuthenticated(true);
          setAuthError(null);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [searchParams]);

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
      setAuthError(null);
      // Redirect to clear any session
      window.location.href = '/';
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'news':
        return <NewsManagement />;
      case 'verification':
        return <VerificationQueue />;
      case 'workflows':
        return <WorkflowDashboard />;
      case 'categories':
        return <CategoriesManagement />;
      case 'profile':
        return <Profile />;
      case 'dashboard':
      default:
        return <Dashboard />;
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

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}