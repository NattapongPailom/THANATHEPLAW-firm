
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  authReady: boolean;
  loginError: string | null;
  /** Firebase error code สำหรับเช็คว่าผิดเพราะอะไร (เช่น auth/user-not-found, auth/wrong-password) */
  loginErrorCode: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginErrorCode, setLoginErrorCode] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthReady(true);
        return;
      }
      try {
        const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
        const isAdminRole = adminSnap.exists() && (adminSnap.data()?.role === 'admin');
        if (isAdminRole) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            role: 'admin',
            loginAt: new Date().toISOString(),
          });
          setLoginError(null);
        } else {
          setLoginError('บัญชีนี้ไม่มีสิทธิ์ Admin');
          await firebaseSignOut(auth);
          setUser(null);
        }
      } catch (e) {
        console.warn('Admin check failed:', e);
        await firebaseSignOut(auth);
        setUser(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    setLoginErrorCode(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Admin login at', new Date().toISOString());
      return true;
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || String(err);
      setLoginErrorCode(code);
      // Log เต็มใน Console เพื่อเช็คว่า Firebase ส่งอะไรมา
      console.error('[Login] Firebase error:', { code, message: msg, email: email.trim() });
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (code === 'auth/too-many-requests') {
        setLoginError('ลองใหม่อีกครั้งในภายหลัง (ถูกจำกัดการเข้าสู่ระบบ)');
      } else {
        setLoginError(msg);
      }
      return false;
    }
  };

  const logout = () => {
    firebaseSignOut(auth);
    setUser(null);
    setLoginError(null);
    setLoginErrorCode(null);
    console.log('✅ Admin logout at', new Date().toISOString());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: !!user,
        authReady,
        loginError,
        loginErrorCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
