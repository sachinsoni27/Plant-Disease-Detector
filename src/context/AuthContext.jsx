import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result from Google/Github sign-in
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        const u = result.user;
        const { doc, getDoc, setDoc } = await import('firebase/firestore');
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', u.uid), {
            name: u.displayName || 'Anonymous',
            email: u.email,
            photoURL: u.photoURL,
            providerId: u.providerId,
            createdAt: new Date().toISOString()
          });
        }
      }
    }).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get extra details from firestore if needed, or just use firebase profile
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Initialize user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const loginWithProvider = async (providerName) => {
    const provider = providerName === 'google' 
      ? new GoogleAuthProvider() 
      : new GithubAuthProvider();
    
    try {
      // Use redirect instead of popup to avoid iframe security errors on deployed domains
      await signInWithRedirect(auth, provider);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const loginWithGoogle = () => loginWithProvider('google');
  const loginWithGithub = () => loginWithProvider('github');

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
