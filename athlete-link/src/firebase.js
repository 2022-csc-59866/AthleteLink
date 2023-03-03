import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCAf8iUzsevxleQ8jWlJe0Tfx0sZP_bw0",
  authDomain: "athletelink-2b0c4.firebaseapp.com",
  projectId: "athletelink-2b0c4",
  storageBucket: "athletelink-2b0c4.appspot.com",
  messagingSenderId: "861605336958",
  appId: "1:861605336958:web:3e8119f1f85516f31b052f",
  measurementId: "G-8W8ZTZL0B0"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const database = firebaseApp.firestore();
const auth = firebase.auth();

export  { auth, database };