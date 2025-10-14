import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // COMMENTED OUT: Authentication functions disabled
  // const signIn = async (email: string, password: string) => {
  //   if (!auth) throw new Error('Firebase not configured');
  //   await signInWithEmailAndPassword(auth, email, password);
  // };

  // const signUp = async (email: string, password: string) => {
  //   if (!auth) throw new Error('Firebase not configured');
  //   await createUserWithEmailAndPassword(auth, email, password);
  // };

  // const signInWithGoogle = async () => {
  //   if (!auth) throw new Error('Firebase not configured');
  //   const provider = new GoogleAuthProvider();
  //   await signInWithPopup(auth, provider);
  // };

  // const signOut = async () => {
  //   if (!auth) throw new Error('Firebase not configured');
  //   await firebaseSignOut(auth);
  // };

  return (
    <AuthContext.Provider value={{ user, loading, signIn: async () => {}, signUp: async () => {}, signInWithGoogle: async () => {}, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
