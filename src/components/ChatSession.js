import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { sendMessage, subscribeToMessages } from '../services/chatService';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../chat.css'; 

const ChatSession = ({ chatSessionId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = getAuth().currentUser?.uid;
  const db = getFirestore();

  const getUserNameById = async (userId, db) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data().name : 'Usuario desconocido';
  };

  useEffect(() => {
    if (chatSessionId) {
      const setMessagesWithSenderName = async (msgs) => {
        const messagesWithNames = await Promise.all(msgs.map(async msg => {
          const senderName = await getUserNameById(msg.senderId, db); 
          return { ...msg, senderName };
        }));
        setMessages(messagesWithNames);
      };

      const unsubscribe = subscribeToMessages(chatSessionId, setMessagesWithSenderName);
      return unsubscribe;
    }
  }, [chatSessionId, db]);

  const handleSend = async () => {
    if (newMessage.trim() && chatSessionId && currentUserId) {
      await sendMessage(chatSessionId, currentUserId, newMessage);
      setNewMessage('');
    }
  };

  return (
    <Container className="chat-container">
      <Row>
        <Col>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                <strong>{msg.senderName}: </strong> {msg.text}
              </div>
            ))}
          </div>
          <Form className="message">
            <Form.Control 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Escribe un mensaje" 
            />
            <Button onClick={handleSend}>Enviar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatSession;
