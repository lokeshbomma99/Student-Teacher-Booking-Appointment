import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

export const logAction = async (userId, action, metadata = {}) => {
  try {
    await addDoc(collection(db, "logs"), {
      userId,
      action,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

export const getLogs = async () => {
  const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
