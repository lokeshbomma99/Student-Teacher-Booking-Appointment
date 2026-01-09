import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getUserRole } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          try {
            const data = await getUserRole(user.uid);
            setCurrentUser(user);
            setUserData(data);
            setUserRole(data?.role || null);
          } catch (dbError) {
            console.error("Error fetching user data:", dbError);
            if (dbError.code === 'permission-denied') {
              alert("Error: Database permission denied. Please ensure Firestore Rules are published in the Firebase Console.");
              await signOut(auth);
              setCurrentUser(null);
            } else {
              // Handle other DB errors (like offline)
              setCurrentUser(user);
              // potentially set an error state to show a banner
            }
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth State Change Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userData,
    loading
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
