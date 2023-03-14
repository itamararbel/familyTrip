// Import the functions you need from the SDKs you need
import {initializeApp}  from 'firebase/app';
import 'firebase/storage'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYi7Tbb6WxnDuWPM5slf2XOxwxSZXamv4",
  authDomain: "play-1b9df.firebaseapp.com",
  projectId: "play-1b9df",
  storageBucket: "play-1b9df.appspot.com",
  messagingSenderId: "719533803840",
  appId: "1:719533803840:web:df1a329728784b88b492a5"
};

// Initialize Firebase
const fireBase = initializeApp(firebaseConfig);


export default fireBase;