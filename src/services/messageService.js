import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { logAction } from "./logService";

export const sendMessage = async (fromId, toId, message) => {
  const msgData = {
    fromId,
    toId,
    message,
    timestamp: serverTimestamp()
  };
  await addDoc(collection(db, "messages"), msgData);
  await logAction(fromId, "SEND_MESSAGE", { toId });
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
  return messages.sort((a, b) => (a.timestamp?.seconds - b.timestamp?.seconds));
};
