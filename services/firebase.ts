import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCVWXHmOrA13aQabrG9YMFUoARF4bFpZ5E",
  authDomain: "project-ka-98e21.firebaseapp.com",
  databaseURL: "https://project-ka-98e21-default-rtdb.firebaseio.com",
  projectId: "project-ka-98e21",
  storageBucket: "project-ka-98e21.firebasestorage.app",
  messagingSenderId: "1076194703214",
  appId: "1:1076194703214:web:1c6587b264f2da1b0f337f",
  measurementId: "G-HQNTC99TPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };