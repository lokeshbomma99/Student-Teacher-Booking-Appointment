import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { logAction } from "./logService";

export const sendMessage = async (fromId, toId, message, appointmentId = null) => {
  const msgData = {
    fromId,
    toId,
    message,
    appointmentId, // Link message to appointment if provided
    timestamp: serverTimestamp()
  };
  await addDoc(collection(db, "messages"), msgData);
  await logAction(fromId, "SEND_MESSAGE", { toId, appointmentId });
};

export const getMessages = async (userId) => {
  // Simple implementation: get all messages where user is sender or receiver
  // In a real app, we might group by conversation
  const qReceived = query(collection(db, "messages"), where("toId", "==", userId));
  const qSent = query(collection(db, "messages"), where("fromId", "==", userId));
  
  const [receivedSnap, sentSnap] = await Promise.all([getDocs(qReceived), getDocs(qSent)]);
  
  const messages = [
    ...receivedSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'received' })),
    ...sentSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'sent' }))
  ];
  
  // Sort by timestamp if needed (client side sort since we merged two queries)
  return messages.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
};

// Get messages between two users for a specific appointment
export const getAppointmentMessages = async (appointmentId, userId1, userId2) => {
  // Get messages where appointmentId matches and users are involved
  const q = query(
    collection(db, "messages"),
    where("appointmentId", "==", appointmentId)
  );
  
  const querySnapshot = await getDocs(q);
  const messages = querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
  
  // Filter to only include messages between the two users
  const filteredMessages = messages.filter(msg => 
    (msg.fromId === userId1 || msg.fromId === userId2) &&
    (msg.toId === userId1 || msg.toId === userId2)
  );
  
  // Sort by timestamp
  return filteredMessages.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
};
