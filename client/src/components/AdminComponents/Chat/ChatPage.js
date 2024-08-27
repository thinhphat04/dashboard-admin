import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../Common/AdminSidebar';
import './ChatPage.css'; // Import CSS

const senderId = '66ccfacdeca122ef96072d96'; // Thay thế bằng adminid
const recipientId = '66ccf972a549c15038af265b'; // Thay thế userid

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/messages/${senderId}/${recipientId}`);
        console.log(response);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();

    ws.current = new WebSocket('ws://192.168.1.3:8000/ws');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        senderId: senderId,
        recipientId: recipientId,
        content: newMessage,
        timestamp: new Date(),
      };
      ws.current.send(JSON.stringify(message));
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      <AdminSidebar />
      <div id="admin-box">
        <h1>Trang Chat</h1>
        <div id="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.senderId === senderId ? 'sent' : 'received'}`}>
              <p>{msg.content}</p>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div id="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Chat;
