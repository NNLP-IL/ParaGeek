import firebase from "firebase/app";
import "firebase/firestore";
// import { getAuth, signInAnonymously } from "firebase/auth";

const settings = { timestampsInSnapshots: true };
const config = {
  apiKey: "AIzaSyBEQyjHBbxx1_oDGUBcJAXX9e2Zs8LpCTE",
  authDomain: "geektimeparashoot.firebaseapp.com",
  projectId: "geektimeparashoot",
  storageBucket: "geektimeparashoot.appspot.com",
  messagingSenderId: "422965642192",
  appId: "1:422965642192:web:90522dc7de0b2b5d3aefd5",
  measurementId: "G-9MPG1KBJ03"
};

firebase.initializeApp(config);
firebase.firestore().settings(settings);
// firebase.auth().signInAnonymously();

export default firebase;