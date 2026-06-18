/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login roommate
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Register roommate & initialize Firestore document
  const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Initialize roommate document in users collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name.trim(),
      email: email.trim(),
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      createdAt: serverTimestamp()
    });
    
    return user;
  };

  // Logout roommate
  const logout = () => {
    return signOut(auth);
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
