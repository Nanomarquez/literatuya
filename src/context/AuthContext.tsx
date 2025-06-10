"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface UserProfile {
  bio: string;
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: {
    displayName?: string | null;
    photoURL?: string | null;
    bio?: string;
  }) => Promise<void>;
  getUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (data: {
    displayName?: string | null;
    photoURL?: string | null;
    bio?: string;
  }) => {
    try {
      if (!user) throw new Error("No hay usuario autenticado");

      let finalPhotoURL = data.photoURL;

      // Si la URL es un blob, subirla a Storage
      if (data.photoURL?.startsWith('blob:')) {
        try {
          const response = await fetch(data.photoURL);
          const blob = await response.blob();
          const storageRef = ref(storage, `profile_images/${user.uid}`);
          await uploadBytes(storageRef, blob);
          finalPhotoURL = await getDownloadURL(storageRef);
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          throw error;
        }
      }

      // Actualizar datos básicos en Auth
      await updateProfile(user, {
        displayName: data.displayName || null,
        photoURL: finalPhotoURL || null,
      });

      // Actualizar datos adicionales en Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          bio: data.bio || "",
          displayName: data.displayName || null,
          photoURL: finalPhotoURL || null,
          email: user.email,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error en updateUserProfile:", error);
      throw error;
    }
  };

  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      if (!user) return null;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }

      // Si no existe el perfil, crear uno por defecto
      const defaultProfile: UserProfile = {
        bio: "",
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error("Error en getUserProfile:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    logout,
    updateUserProfile,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
