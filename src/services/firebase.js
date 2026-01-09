import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBUL0bPrCqAPe26X17hcX_c6dKWApvjYY8",
  authDomain: "student-teacher-1bcb6.firebaseapp.com",
  projectId: "student-teacher-1bcb6",
  storageBucket: "student-teacher-1bcb6.firebasestorage.app",
  messagingSenderId: "242064629622",
  appId: "1:242064629622:web:0f96560f407d85cc53a457",
  measurementId: "G-Y9MFF592RL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
