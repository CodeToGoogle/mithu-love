import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkhXWyAOjEwMgyBa0S7LL8oR1XLLw8X6o",
  authDomain: "love-d98db.firebaseapp.com",
  projectId: "love-d98db",
  storageBucket: "love-d98db.firebasestorage.app",
  messagingSenderId: "1070790755565",
  appId: "1:1070790755565:web:246bab6bc924028b8b38e4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (for photo metadata: imageUrl, caption, date)
// NOTE: Firebase Storage is no longer used — actual image files now
// live on Cloudinary instead (see cloudinary.js). Firestore only
// stores the metadata that points to them.
export const db = getFirestore(app);

// Initialize Auth — used to gate uploads/edits/deletes to just you.
// Anyone can still view the gallery without logging in.
export const auth = getAuth(app);

export default app;
