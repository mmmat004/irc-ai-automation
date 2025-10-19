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
  const [isAuthenticated, setIsAuthenticated] = useState(
    process.env.NEXT_PUBLIC_DEMO === 'true'
  );
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;
    
    // Check if user just authenticated
    if (searchParams.get('authenticated') === 'true') {
      setIsAuthenticated(true);
      setAuthError(null);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }

    // Check for authentication errors
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'access_denied': 'Access denied. Please try again.',
        'no_code': 'Authentication failed. Please try again.',
        'invalid_account': 'Invalid account. Please use an authorized account.',
      };
      setAuthError(
        decodeURIComponent(errorParam) in errorMessages
          ? errorMessages[decodeURIComponent(errorParam)]
          : decodeURIComponent(errorParam)
      );
      setIsAuthenticated(false);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }

    // Check for existing auth token
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated) {
      // Verify token is still valid
      fetch(API_ENDPOINTS.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })
        .then(response => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
        });
    }
  }, [searchParams, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setCurrentPage('dashboard');
      setAuthError(null);
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