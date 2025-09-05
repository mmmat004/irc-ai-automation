import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  const loadUserFromToken = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const payload = JSON.parse(atob(parts[1]));
      console.log('Loading user from JWT:', payload);

      const userData: User = {
        id: payload.sub || payload.user_id || "",
        name: payload.name || payload.email || "User",
        email: payload.email || "",
        picture: payload.picture || payload.avatar || "https://lh3.googleusercontent.com/a/default-user",
        given_name: payload.given_name || payload.first_name || payload.name?.split(' ')[0] || "",
        family_name: payload.family_name || payload.last_name || payload.name?.split(' ')[1] || "",
        email_verified: Boolean(payload.email_verified),
        role: payload.role || "Admin",
      };

      setUser(userData);
    } catch (error) {
      console.error('Failed to load user from token:', error);
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
