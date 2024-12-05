'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole } from '../lib/auth-utils';

interface AuthUser extends User {
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role?: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          document.cookie = `auth-token=${token}; path=/`;
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          if (!userData) {
            throw new Error('User data not found');
          }
          
          const role = userData.role as UserRole;
          document.cookie = `user-role=${role}; path=/`;
          setUser({ ...user, role });
        } catch (error) {
          console.error('Error setting user:', error);
          setUser(null);
        }
      } else {
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<UserRole> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      if (!userData || !userData.role) {
        throw new Error('User role not found');
      }
      
      const role = userData.role as UserRole;
      const token = await userCredential.user.getIdToken();
      
      document.cookie = `auth-token=${token}; path=/`;
      document.cookie = `user-role=${role}; path=/`;
      
      setUser({ ...userCredential.user, role });
      return role;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, role: UserRole = 'user') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role,
        createdAt: new Date().toISOString()
      });
      setUser({ ...userCredential.user, role });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear any stored auth data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      // Clear any other auth-related state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 