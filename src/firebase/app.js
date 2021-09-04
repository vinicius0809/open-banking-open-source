import firebase from "firebase/app";
// import {initializeApp } from 'firebase/app';
import 'firebase/functions';
// import 'firebase/auth';
import 'firebase/firestore';
// import 'firebase/storage';

const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};
console.log(config);

export const App = firebase.initializeApp(config);

// export const AUTH = App.auth();
export const DB = App.firestore();
// export const STORAGE = App.storage();
export const FUNCTIONS = App.functions("southamerica-east1");