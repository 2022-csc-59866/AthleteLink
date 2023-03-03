import firebase from "firebase";

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

const firebaseApp = firebase.initializeApp(firebaseConfig);

const database = firebaseApp.firestore;

export default database;