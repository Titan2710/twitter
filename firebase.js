// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getFirestore } from 'firebase/firestore'
import {getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: AIzaSyCie_Pc9afYpdrJ9_7mbK6Zczx8I6N-6Rw,
  authDomain: "twitter-26992.firebaseapp.com",
  projectId: "twitter-26992",
  storageBucket: "twitter-26992.appspot.com",
  messagingSenderId: "403281804407",
  appId: "1:403281804407:web:3ccf34a979cfd4c4c09a72"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore()
const storage = getStorage();
export {app, db, storage}