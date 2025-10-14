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

interface AnonymousUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isAnonymous: true;
}

interface AuthContextType {
  user: User | AnonymousUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | AnonymousUser | null>(null);
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


  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not configured');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not configured');
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not configured');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInAnonymously = async () => {
    // Create anonymous user object
    const anonymousUser: AnonymousUser = {
      uid: 'anonymous_' + Date.now(),
      email: 'unknown@anonymous.com',
      displayName: 'Unknown User',
      photoURL: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1760428883/unknownUser_wfly4l.png',
      isAnonymous: true
    };
    setUser(anonymousUser);
  };

  const signOut = async () => {
    if (user && 'isAnonymous' in user && user.isAnonymous) {
      // For anonymous users, just clear the user state
      setUser(null);
    } else if (auth) {
      // For Firebase users, use Firebase signOut
      await firebaseSignOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signInAnonymously,
      signOut
    }}>
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
