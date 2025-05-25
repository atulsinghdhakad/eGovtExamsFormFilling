// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAvTNh-91WOWEsLVu04lRRshpJlpJ6yMb0",
    authDomain: "coachingfinder-5bd16.firebaseapp.com",
    projectId: "coachingfinder-5bd16",
    storageBucket: "coachingfinder-5bd16.appspot.com",
    messagingSenderId: "1085122910276",
    appId: "1:1085122910276:web:ce30b697dc8c454f46c411",
    measurementId: "G-10CDNXPFDF"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Initialize Auth providers
const googleProvider = new GoogleAuthProvider();

const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
    display: 'popup',
});

export {
    app,
    auth,
    firestore,
    storage,
    googleProvider,
    facebookProvider
};
