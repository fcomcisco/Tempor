import React, { useState, useEffect } from 'react';
import { getChatSessions } from '../services/chatService';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import ChatSession from './ChatSession';

const ChatList = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedChatSessionId, setSelectedChatSessionId] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;
  const db = getFirestore();

  useEffect(() => {
    if (userId) {
      const getUserNameById = async (userId) => {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() ? userDoc.data().name : 'Usuario Desconocido';
      };

      getChatSessions(userId, async (sessions) => {
        const sessionsWithNames = await Promise.all(sessions.map(async (session) => {
          const otherUserId = session.participants.find(id => id !== userId);
          const otherUserName = await getUserNameById(otherUserId);
          return { ...session, otherUserName };
        }));
        setChatSessions(sessionsWithNames);
      });
    }
  }, [userId, db]);

  const selectChatSession = (chatSessionId) => {
    setSelectedChatSessionId(chatSessionId);
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        <h2>Tus Chats</h2>
        {chatSessions.length === 0 ? (
          <p>No se encontraron chats existentes.</p>
        ) : (
          chatSessions.map((session) => (
            <div key={session.id} className="chat-session">
              <button onClick={() => selectChatSession(session.id)}>
                Chat con {session.otherUserName}
              </button>
            </div>
          ))
        )}
      </div>
      <div className="chat-session-container">
        {selectedChatSessionId && <ChatSession chatSessionId={selectedChatSessionId} currentUserId={userId} />}
      </div>
    </div>
  );
};

export default ChatList;
