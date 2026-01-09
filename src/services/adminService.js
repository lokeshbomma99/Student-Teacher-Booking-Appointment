import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const getAllAppointments = async () => {
  const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
