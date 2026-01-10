import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { logAction } from "./logService";

export const bookAppointment = async (studentId, teacherId, date, time, purpose) => {
  const appointment = {
    studentId,
    teacherId,
    date,
    time,
    purpose,
    status: 'pending',
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, "appointments"), appointment);
  await logAction(studentId, "BOOK_APPOINTMENT", { appointmentId: docRef.id, teacherId });
  return docRef.id;
};

export const getAppointmentsForTeacher = async (teacherId) => {
  const q = query(
    collection(db, "appointments"), 
    where("teacherId", "==", teacherId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAppointmentsForStudent = async (studentId) => {
  const q = query(collection(db, "appointments"), where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAppointmentStatus = async (appointmentId, status, userId) => {
  const appointmentRef = doc(db, "appointments", appointmentId);
  await updateDoc(appointmentRef, { status });
  await logAction(userId, "UPDATE_APPOINTMENT_STATUS", { appointmentId, status });
};
