import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loadUserFromToken: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loadUserFromToken = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Loading user from backend API:', userData);
        setUser(userData);
      } else {
        console.error('Failed to load user from backend:', response.status);
        setUser(null);
        // If unauthorized, clear any stored token
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Failed to load user from backend:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadUserFromToken }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
