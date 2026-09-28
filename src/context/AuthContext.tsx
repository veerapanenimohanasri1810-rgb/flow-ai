import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  loginAsGuest: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('flowai_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default logged in as Alex Chen for seamless instant preview
    return {
      uid: 'usr_alex_chen',
      email: 'alex.chen@flowai.work',
      displayName: 'Alex Chen',
    };
  });

  const [profile, setProfile] = useState<UserProfile>(() => dataService.getProfile());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setProfile(dataService.getProfile());
    });
    return unsubscribe;
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Simulating authentication (prepared for Firebase signInWithEmailAndPassword)
    const displayName = email.split('@')[0].replace(/[._]/g, ' ');
    const authedUser: AuthUser = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
    };
    setUser(authedUser);
    localStorage.setItem('flowai_auth_user', JSON.stringify(authedUser));
    dataService.updateProfile({
      name: authedUser.displayName,
      email: authedUser.email,
    });
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    // Simulating registration (prepared for Firebase createUserWithEmailAndPassword)
    const authedUser: AuthUser = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: name,
    };
    setUser(authedUser);
    localStorage.setItem('flowai_auth_user', JSON.stringify(authedUser));
    dataService.updateProfile({
      name,
      email,
    });
    return true;
  };

  const forgotPassword = async (_email: string): Promise<boolean> => {
    // Simulating password reset email trigger
    return true;
  };

  const loginAsGuest = () => {
    const guestUser: AuthUser = {
      uid: 'usr_guest',
      email: 'guest@flowai.work',
      displayName: 'Demo Guest',
      isAnonymous: true,
    };
    setUser(guestUser);
    localStorage.setItem('flowai_auth_user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flowai_auth_user');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    const updated = dataService.updateProfile(updates);
    setProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        loginAsGuest,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
