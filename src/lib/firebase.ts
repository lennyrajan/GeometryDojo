import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCbGaSdWOaIkPfsZkA0g8jAbjPQsIdXci4",
    authDomain: "geometry-dojo.firebaseapp.com",
    projectId: "geometry-dojo",
    storageBucket: "geometry-dojo.firebasestorage.app",
    messagingSenderId: "901652858388",
    appId: "1:901652858388:web:0e9684d9820ec80c654901",
    measurementId: "G-BHGK4RF5G7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
