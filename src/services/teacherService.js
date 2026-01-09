import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getAllTeachers = async () => {
  const q = query(collection(db, "teachers"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const searchTeachers = async (term) => {
  // Firestore doesn't support native full-text search. 
  // We'll fetch all teachers and filter client-side for this demo.
  // In production, use Algolia or similar.
  const teachers = await getAllTeachers();
  const lowerTerm = term.toLowerCase();
  return teachers.filter(t => 
    t.name?.toLowerCase().includes(lowerTerm) || 
    t.department?.toLowerCase().includes(lowerTerm) || 
    t.subject?.toLowerCase().includes(lowerTerm)
  );
};
