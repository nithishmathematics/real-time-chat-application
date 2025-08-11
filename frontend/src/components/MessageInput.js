import React, { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  return (
    <div className="message-input">
      <input
        placeholder="Type a message and press Enter..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { onSend(text); setText(''); } }}
      />
      <button className="btn" onClick={() => { onSend(text); setText(''); }}>Send</button>
    </div>
  );
}