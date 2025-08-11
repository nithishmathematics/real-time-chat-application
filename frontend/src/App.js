import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import './styles/chat.css';

export default function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [joined, setJoined] = useState(false);

  return (
    <div className="app-root">
      {!joined ? (
        <div className="join-screen">
          <div className="join-card">
            <img src="/logo192.png" alt="logo" className="logo" />
            <h1>GlamChat</h1>
            <p className="sub">Real-time chat with beautiful UI</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your display name" />
            <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room (e.g., general)" />
            <button className="btn" onClick={() => username.trim() && setJoined(true)}>Join Room</button>
            <p className="tip">Tip: Try room names like <strong>general</strong>, <strong>dev</strong>, or <strong>random</strong>.</p>
          </div>
        </div>
      ) : (
        <div className="main-layout">
          <Sidebar username={username} room={room} onLeave={() => setJoined(false)} />
          <ChatWindow username={username} room={room} />
        </div>
      )}
    </div>
  );
}