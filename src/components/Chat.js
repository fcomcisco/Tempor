// Chat.js
import React from 'react';
import ChatList from './ChatList';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { currentUserId } = useParams();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 2, overflowY: 'auto' }}>
        <ChatList currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default Chat;
