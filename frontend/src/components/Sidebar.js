import React from 'react';

export default function Sidebar({ username, room, onLeave }) {
  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
        <div>
          <h3>{username}</h3>
          <p className="muted">In {room}</p>
        </div>
      </div>
      <div className="rooms">
        <h4>Rooms</h4>
        <ul>
          <li># general</li>
          <li># dev</li>
          <li># random</li>
        </ul>
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={onLeave}>Leave Room</button>
      </div>
    </aside>
  );
}