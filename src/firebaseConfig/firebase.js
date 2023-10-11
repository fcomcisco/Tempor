import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyCuD00o28wghUvZcPUZ4wBRXVosAmLwyxg",
  authDomain: "crud-4ffc9.firebaseapp.com",
  projectId: "crud-4ffc9",
  storageBucket: "crud-4ffc9.appspot.com",
  messagingSenderId: "864403669388",
  appId: "1:864403669388:web:f543ecb3ea8bd1867f96a9",
  measurementId: "G-CVD6HZGZCW"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
