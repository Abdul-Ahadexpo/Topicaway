import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDhcl5-axgP59PvrhOqc1azBaDwO_VsHjQ",
  authDomain: "lateexam-prep.firebaseapp.com",
  databaseURL: "https://lateexam-prep-default-rtdb.firebaseio.com",
  projectId: "lateexam-prep",
  storageBucket: "lateexam-prep.firebasestorage.app",
  messagingSenderId: "814062210217",
  appId: "1:814062210217:web:a1baa14ae8dc6b93a16db8"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);