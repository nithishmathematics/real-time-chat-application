import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../api';
import MessageInput from './MessageInput';

export default function ChatWindow({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [system, setSystem] = useState([]);
  const chatRef = useRef();

  useEffect(() => {
    socket.auth = { username };
    socket.connect();
    socket.emit('joinRoom', { room, user: username });

    socket.on('roomHistory', (msgs) => setMessages(msgs));
    socket.on('receiveMessage', (msg) => setMessages((m) => [...m, msg]));
    socket.on('systemMessage', (msg) => setSystem((s) => [...s, msg]));

    return () => {
      socket.emit('leaveRoom', { room, user: username });
      socket.off('roomHistory');
      socket.off('receiveMessage');
      socket.off('systemMessage');
      socket.disconnect();
    };
  }, [room, username]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, system]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    socket.emit('sendMessage', { room, user: username, text });
  };

  return (
    <section className="chat-window">
      <header className="chat-header">
        <h2>#{room}</h2>
        <p className="muted">Logged in as <strong>{username}</strong></p>
      </header>

      <div className="messages" ref={chatRef}>
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.user === username ? 'mine' : ''}`}>
            <div className="avatar-mini">{m.user.charAt(0).toUpperCase()}</div>
            <div className="bubble">
              <div className="meta"><strong>{m.user}</strong> <span className="time">{new Date(m.time).toLocaleTimeString()}</span></div>
              <div className="text">{m.text}</div>
            </div>
          </div>
        ))}
        {system.map((s, idx) => (
          <div key={`sys-${idx}`} className="system">{s.text}</div>
        ))}
      </div>

      <MessageInput onSend={handleSend} />
    </section>
  );
}
