import { auth, db } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp,
  deleteDoc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { logAction } from "./logService";

export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const { role, name, ...otherData } = userData;
    
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      name,
      role,
      approved: role === 'teacher' ? false : true, // Only teachers need admin approval, students are auto-approved
      ...otherData
    });

    if (role === 'teacher') {
      await setDoc(doc(db, "teachers", user.uid), {
        id: user.uid,
        name,
        email,
        ...otherData // department, subject
      });
    }

    await logAction(user.uid, "REGISTER", { role, email });
    return user;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDoc = await getDoc(doc(db, "users", user.uid));
  
  if (!userDoc.exists()) {
    await signOut(auth);
    throw new Error("User profile not found. This account may have been created without a database entry. Please delete the user in Firebase Auth or register with a new email.");
  }

  const userData = userDoc.data();

  if (userData.role === 'teacher' && !userData.approved) {
    await signOut(auth);
    throw new Error("Account not approved yet. Please wait for admin approval.");
  }

  await logAction(user.uid, "LOGIN", { email });
  return { user, role: userData.role, userData };
};

export const logoutUser = async (userId) => {
  await logAction(userId, "LOGOUT");
  await signOut(auth);
};

export const getUserRole = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const getUserName = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.name || 'Unknown';
  }
  return 'Unknown';
};

export const getAllUsers = async () => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approveUser = async (userId, adminId) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { approved: true });
  await logAction(adminId, "APPROVE_USER", { userId });
};

export const deleteUser = async (userId, adminId) => {
  await deleteDoc(doc(db, "users", userId));
  const teacherRef = doc(db, "teachers", userId);
  const teacherDoc = await getDoc(teacherRef);
  if (teacherDoc.exists()) {
    await deleteDoc(teacherRef);
  }
  await logAction(adminId, "DELETE_USER", { userId });
};
