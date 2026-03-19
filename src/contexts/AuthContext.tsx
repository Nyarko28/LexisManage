import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, doc, getDoc, setDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateDoc } from '../firebase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (inviteId?: string) => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  emailSignup: (email: string, password: string, name: string, role?: UserRole, inviteId?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // Create new user profile
          const inviteId = sessionStorage.getItem('pendingInviteId');
          let role: UserRole = firebaseUser.email === 'lemonadimat@gmail.com' ? 'admin' : 'viewer';
          
          if (inviteId) {
            try {
              const inviteRef = doc(db, 'invites', inviteId);
              const inviteSnap = await getDoc(inviteRef);
              if (inviteSnap.exists() && inviteSnap.data().status === 'pending') {
                role = inviteSnap.data().role;
                await updateDoc(inviteRef, { status: 'accepted' });
              }
            } catch (err) {
              console.error("Error processing invite during Google login:", err);
            } finally {
              sessionStorage.removeItem('pendingInviteId');
            }
          }

          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Anonymous',
            role: role,
            ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (inviteId?: string) => {
    try {
      if (inviteId) {
        sessionStorage.setItem('pendingInviteId', inviteId);
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  const emailSignup = async (email: string, password: string, name: string, role: UserRole = 'viewer', inviteId?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', result.user.uid);
      
      const newUser: User = {
        uid: result.user.uid,
        email: email,
        displayName: name,
        role: role,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUser);
      
      if (inviteId) {
        const inviteRef = doc(db, 'invites', inviteId);
        await updateDoc(inviteRef, { status: 'accepted' });
      }
      
      setUser(newUser);
    } catch (error) {
      console.error("Email signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    emailLogin,
    emailSignup,
    logout,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor' || user?.role === 'admin',
    isViewer: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
