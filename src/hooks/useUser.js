import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig/firebase';

export const useUser = () => {
  const getUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  };

  const setUserProfile = async (uid, data) => {
    const userDoc = doc(db, "users", uid);
    await setDoc(userDoc, data);
  };

  return { getUserProfile, setUserProfile };
};
