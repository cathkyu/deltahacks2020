import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1d9ZdMIkwiOexhNy4RPon1B4iNwHqydk",
  authDomain: "tr4shc0de.firebaseapp.com",
  databaseURL: "https://tr4shc0de.firebaseio.com",
  projectId: "tr4shc0de",
  storageBucket: "tr4shc0de.appspot.com",
  messagingSenderId: "657140696877",
  appId: "1:657140696877:web:ff37f23627020b8af635a4",
  measurementId: "G-HXK6N6DWHP"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;
