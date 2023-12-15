import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';


export const sendMessage = async (chatSessionId, senderId, text) => {
  if (!chatSessionId || !senderId) {
    console.error("Invalid chatSessionId or senderId");
    return;
  }

  await addDoc(collection(db, 'messages'), {
    chatSessionId,
    senderId,
    text,
    timestamp: new Date()
  });
};

export const subscribeToMessages = (chatSessionId, callback) => {
  if (!chatSessionId) {
    console.error("Invalid chatSessionId");
    return () => {}; 
  }

  const q = query(collection(db, 'messages'), where('chatSessionId', '==', chatSessionId), orderBy('timestamp'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const getChatSessions = async (userId, callback) => {
  if (!userId) {
    console.error("Invalid userId");
    return;
  }

  const q = query(collection(db, 'chatSessions'), where('participants', 'array-contains', userId));

  const querySnapshot = await getDocs(q);
  const sessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  callback(sessions);
};
