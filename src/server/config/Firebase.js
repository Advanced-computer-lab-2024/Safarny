// Import the necessary Firebase functions
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDzTFZ5SliOyUTdo0oR_K4p2v7jGobsK-E",
  authDomain: "safarny-c8750.firebaseapp.com",
  projectId: "safarny-c8750",
  storageBucket: "safarny-c8750.appspot.com",
  messagingSenderId: "674655970659",
  appId: "1:674655970659:web:0de3cc1e56aaaaee19df56",
  measurementId: "G-2R26WKXFY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
