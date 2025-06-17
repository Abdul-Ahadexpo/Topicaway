import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC0XSOa4mwAyTQkFn8ade_oRckRxQjN-Xc",
  authDomain: "topicaway.firebaseapp.com",
  projectId: "topicaway",
  storageBucket: "topicaway.firebasestorage.app",
  messagingSenderId: "195296186273",
  appId: "1:195296186273:web:d4037cae9f69dcb50ec5e0"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
