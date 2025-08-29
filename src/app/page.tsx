'use client';

import { useState } from "react";
import { Toaster } from "sonner@2.0.3";
import { Sidebar } from "../components/Sidebar";
import { Dashboard } from "../components/Dashboard";
import { NewsManagement } from "../components/NewsManagement";
import { VerificationQueue } from "../components/VerificationQueue";
import { WorkflowDashboard } from "../components/WorkflowDashboard";
import { CategoriesManagement } from "../components/CategoriesManagement";
import { Profile } from "../components/Profile";
import { Login } from "../components/Login";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
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