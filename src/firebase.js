import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

import "firebase/storage";

import { GeoFirestore } from "geofirestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCAf8iUzsevxleQ8jWlJe0Tfx0sZP_bw0",
  authDomain: "athletelink-2b0c4.firebaseapp.com",
  projectId: "athletelink-2b0c4",
  storageBucket: "athletelink-2b0c4.appspot.com",
  messagingSenderId: "861605336958",
  appId: "1:861605336958:web:3e8119f1f85516f31b052f",
  measurementId: "G-8W8ZTZL0B0",
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

// Use these for db & auth
const database = firebaseApp.firestore();
const auth = firebase.auth();
const geofirestore = new GeoFirestore(firestore);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
  } else {
    console.log("No user is signed in");
  }
});

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, database, provider, geofirestore };
