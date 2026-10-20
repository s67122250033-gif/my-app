import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE",
  authDomain: "it-tracking-system.firebaseapp.com",
  databaseURL: "https://it-tracking-system-default-rtdb.firebaseio.com",
  projectId: "it-tracking-system",
  storageBucket: "it-tracking-system.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);