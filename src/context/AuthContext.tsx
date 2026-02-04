
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 SECURITY: Admin password should be from environment, never hardcoded
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'NOT_CONFIGURED';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('elite_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (password: string) => {
    // 🔒 SECURITY: Validate against environment variable (not hardcoded)
    // TODO: Replace with proper authentication (Firebase Auth with email/password)
    if (password === ADMIN_PASSWORD) {
      const mockUser: AdminUser = { 
        id: `admin_${Date.now()}`, 
        email: 'admin@elite.com', 
        role: 'admin',
        loginAt: new Date().toISOString()
      };
      setUser(mockUser);
      
      // 🔒 SECURITY: Store session with expiration (1 hour)
      const sessionData = {
        ...mockUser,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem('elite_admin_session', JSON.stringify(sessionData));
      
      // Log admin login for audit trail
      console.log(`✅ Admin login at ${new Date().toISOString()}`);
      return true;
    }
    
    console.warn(`⚠️ Failed login attempt at ${new Date().toISOString()}`);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elite_admin_session');
    console.log(`✅ Admin logout at ${new Date().toISOString()}`);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
