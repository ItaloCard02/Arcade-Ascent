import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAX0moEF-vxni8-TCW9omBEKVxxBJVw7ZE",
  authDomain: "arcade-ascent-1f977.firebaseapp.com",
  projectId: "arcade-ascent-1f977",
  storageBucket: "arcade-ascent-1f977.firebasestorage.app",
  messagingSenderId: "240535301668",
  appId: "1:240535301668:web:c74d0e68c700af0eff72b1"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };