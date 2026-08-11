'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserDoc } from '@/services/user-service';
import { UserAccount } from '@/types/user-account';

const AuthContext = createContext<UserAccount | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Update the current user/auth state whenever a sign in or sign out occurs
    const unsubscribe = onAuthStateChanged(auth, (_currentUser) => {
      if (_currentUser) {
        // Want our UserAccount type carried throughout the app, not the firebase user object
        getUserDoc(_currentUser.uid).then(function (_currentUserAccount) {
          setCurrentUser(_currentUserAccount);
          setIsLoading(false);
        });
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if(!isLoading) {
    return (
      <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
    );
  }
}

export function useAuth() {
  return useContext(AuthContext);
}
