/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; popupBlocked?: boolean }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; unverified?: boolean }>;
  signupWithEmail: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  checkEmailVerified: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserPhone: (phone: string) => void;
  logout: () => Promise<void>;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => boolean;
  isPropertySaved: (id: string) => boolean;
  loginWithDemoAccount: (demo: { name: string; email: string; photoURL?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_SAVED_KEY = 'avenue_guest_saved_homes_v3';
const USER_PHONE_PREFIX = 'avenue_user_phone_';
const USER_SAVED_PREFIX = 'avenue_user_saved_';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestSavedIds, setGuestSavedIds] = useState<string[]>([]);

  // Load guest saved properties
  useEffect(() => {
    try {
      const guestSavedRaw = localStorage.getItem(GUEST_SAVED_KEY);
      if (guestSavedRaw) {
        setGuestSavedIds(JSON.parse(guestSavedRaw));
      }
    } catch (e) {
      console.error('Failed to load guest saved properties', e);
    }
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const storedPhone = localStorage.getItem(`${USER_PHONE_PREFIX}${fbUser.uid}`) || '';
        const storedSavedRaw = localStorage.getItem(`${USER_SAVED_PREFIX}${fbUser.uid}`);
        let savedIds: string[] = storedSavedRaw ? JSON.parse(storedSavedRaw) : [];

        // Merge guest saved IDs if any
        if (guestSavedIds.length > 0) {
          savedIds = Array.from(new Set([...savedIds, ...guestSavedIds]));
          localStorage.setItem(`${USER_SAVED_PREFIX}${fbUser.uid}`, JSON.stringify(savedIds));
          localStorage.removeItem(GUEST_SAVED_KEY);
          setGuestSavedIds([]);
        }

        const isGoogle = fbUser.providerData.some((p) => p.providerId === 'google.com');

        const profile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Avenue Member',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
          phone: storedPhone || undefined,
          emailVerified: fbUser.emailVerified || isGoogle,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          savedPropertyIds: savedIds,
        };

        setCurrentUser(profile);
      } else {
        // Only clear if not in demo session
        const demoSession = sessionStorage.getItem('avenue_demo_session');
        if (demoSession) {
          try {
            setCurrentUser(JSON.parse(demoSession));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [guestSavedIds]);

  // 1. Google Sign-in with popup and fallback to redirect
  const loginWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
    popupBlocked?: boolean;
  }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return { success: true };
    } catch (error: any) {
      console.warn('Google sign-in popup error:', error?.code, error?.message);

      if (error?.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { success: true, popupBlocked: true };
        } catch (redirectError: any) {
          return {
            success: false,
            error: 'Popup was blocked by your browser. Please enable popups for this site.',
          };
        }
      } else if (error?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in was cancelled.' };
      } else if (error?.code === 'auth/network-request-failed') {
        return { success: false, error: 'Network error. Please check your internet connection.' };
      } else if (error?.code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          error: 'An account already exists with this email. Please log in with your password.',
        };
      } else if (error?.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Unauthorized domain. Please authorize this app URL in the Firebase Console.',
        };
      }

      return {
        success: false,
        error: error?.message || 'Could not complete Google sign-in. Please try again.',
      };
    }
  };

  // 2. Email & Password Login
  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; unverified?: boolean }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        return { success: false, unverified: true };
      }

      return { success: true };
    } catch (error: any) {
      console.warn('Email login error:', error?.code);
      if (
        error?.code === 'auth/user-not-found' ||
        error?.code === 'auth/wrong-password' ||
        error?.code === 'auth/invalid-credential'
      ) {
        return { success: false, error: 'Incorrect email or password. Please verify and try again.' };
      } else if (error?.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many unsuccessful attempts. Please reset your password or try again later.',
        };
      } else if (error?.code === 'auth/network-request-failed') {
        return { success: false, error: 'Network error. Please check your internet connection.' };
      }
      return { success: false, error: error?.message || 'Sign in failed. Please try again.' };
    }
  };

  // 3. Signup with Email & Password (no phone required!)
  const signupWithEmail = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );

      // Update user display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: data.name.trim(),
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);

      return { success: true };
    } catch (error: any) {
      console.warn('Signup error:', error?.code);
      if (error?.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'An account with this email already exists. Please log in.',
        };
      } else if (error?.code === 'auth/invalid-email') {
        return { success: false, error: 'Please provide a valid email address.' };
      } else if (error?.code === 'auth/weak-password') {
        return { success: false, error: 'Password should be at least 8 characters.' };
      }
      return { success: false, error: error?.message || 'Registration failed. Please try again.' };
    }
  };

  // 4. Resend verification email
  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return { success: false, error: 'No active session found to verify.' };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Failed to resend verification email.' };
    }
  };

  // 5. Reload & check email verified
  const checkEmailVerified = async (): Promise<boolean> => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          if (currentUser) {
            setCurrentUser({ ...currentUser, emailVerified: true });
          }
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  // 6. Send password reset email
  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error: any) {
      if (error?.code === 'auth/user-not-found') {
        return { success: false, error: 'No account found with this email address.' };
      }
      return { success: false, error: error?.message || 'Could not send reset email.' };
    }
  };

  // 7. Update phone number (strictly optional on Profile)
  const updateUserPhone = (phone: string) => {
    if (currentUser) {
      const updated = { ...currentUser, phone };
      setCurrentUser(updated);
      localStorage.setItem(`${USER_PHONE_PREFIX}${currentUser.id}`, phone);
    }
  };

  // 8. Demo Account fallback chooser
  const loginWithDemoAccount = (demo: { name: string; email: string; photoURL?: string }) => {
    const demoProfile: UserProfile = {
      id: `demo_${Date.now()}`,
      name: demo.name,
      email: demo.email,
      photoURL: demo.photoURL,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      savedPropertyIds: guestSavedIds,
    };
    setCurrentUser(demoProfile);
    sessionStorage.setItem('avenue_demo_session', JSON.stringify(demoProfile));
  };

  // 9. Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error', e);
    }
    sessionStorage.removeItem('avenue_demo_session');
    setCurrentUser(null);
  };

  // 10. Saved properties management
  const isPropertySaved = (id: string): boolean => {
    if (currentUser) {
      return currentUser.savedPropertyIds.includes(id);
    }
    return guestSavedIds.includes(id);
  };

  const toggleSaveProperty = (id: string): boolean => {
    if (currentUser) {
      const alreadySaved = currentUser.savedPropertyIds.includes(id);
      const newSavedIds = alreadySaved
        ? currentUser.savedPropertyIds.filter((pId) => pId !== id)
        : [...currentUser.savedPropertyIds, id];

      const updatedProfile: UserProfile = {
        ...currentUser,
        savedPropertyIds: newSavedIds,
      };

      setCurrentUser(updatedProfile);
      localStorage.setItem(`${USER_SAVED_PREFIX}${currentUser.id}`, JSON.stringify(newSavedIds));
      return !alreadySaved;
    } else {
      // Guest mode
      const alreadySaved = guestSavedIds.includes(id);
      const newSaved = alreadySaved
        ? guestSavedIds.filter((pId) => pId !== id)
        : [...guestSavedIds, id];
      setGuestSavedIds(newSaved);
      localStorage.setItem(GUEST_SAVED_KEY, JSON.stringify(newSaved));
      return !alreadySaved;
    }
  };

  const savedPropertyIds = currentUser ? currentUser.savedPropertyIds : guestSavedIds;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthenticated: !!currentUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resendVerificationEmail,
        checkEmailVerified,
        sendPasswordReset,
        updateUserPhone,
        logout,
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        loginWithDemoAccount,
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
