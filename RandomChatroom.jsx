import React, { useState, useRef, useEffect } from 'react';

const AI_NAME = 'Gemini';

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg, #fff)',
    color: 'var(--text-color, #222)',
    padding: '0',
  },
  header: {
    padding: '1.2rem',
    fontWeight: 700,
    fontSize: '1.4rem',
    textAlign: 'center',
    background: 'var(--header-bg, #007bff)',
    color: '#fff',
    letterSpacing: 1,
    borderBottom: '1px solid #eee',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '1.2rem',
    background: 'var(--chat-bg, #f9f9f9)',
  },
  msgRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    maxWidth: '90%',
  },
  msgUser: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(90deg,#007bff,#43a047)',
    color: '#fff',
    borderRadius: '16px 16px 4px 16px',
    padding: '0.8rem 1.2rem',
    fontSize: '1.05rem',
    marginBottom: 2,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    wordBreak: 'break-word',
  },
  msgAI: {
    alignSelf: 'flex-start',
    background: '#f1f1f1',
    color: '#222',
    borderRadius: '16px 16px 16px 4px',
    padding: '0.8rem 1.2rem',
    fontSize: '1.05rem',
    marginBottom: 2,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: 2,
    marginLeft: 4,
  },
  typing: {
    fontStyle: 'italic',
    color: '#888',
    margin: '0.5rem 0',
    fontSize: '1rem',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    padding: '1.2rem',
    borderTop: '1px solid #eee',
    background: 'var(--input-bg, #fafafa)',
  },
  input: {
    flex: 1,
    padding: '0.9rem',
    fontSize: '1.05rem',
    border: '1px solid #ccc',
    borderRadius: 8,
    outline: 'none',
    background: 'var(--input-bg, #fafafa)',
  },
  sendBtn: {
    background: 'linear-gradient(90deg,#007bff,#43a047)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.9rem 1.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1.05rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  imgThumb: {
    maxWidth: 140,
    maxHeight: 140,
    borderRadius: 8,
    marginTop: 6,
    display: 'block',
  },
  copyTip: {
    position: 'absolute',
    top: -28,
    right: 0,
    background: '#222',
    color: '#fff',
    fontSize: '0.85rem',
    borderRadius: 6,
    padding: '2px 8px',
    zIndex: 10,
    pointerEvents: 'none',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 18,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 22,
    cursor: 'pointer',
    fontWeight: 700,
    zIndex: 10,
  },
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function RandomChatroom({ onBack }) {
  const [messages, setMessages] = useState([]); // Always fresh
  const [input, setInput] = useState('');
  const [img, setImg] = useState(null);
  const [typing, setTyping] = useState(false);
  const [copyTipId, setCopyTipId] = useState(null);
  const messagesRef = useRef();

  // Always reset messages on mount for a fresh chat
  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages.length]);

  const sendAIReply = (userMsg) => {
    setTyping(true);
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        {
          id: msgs.length + 1,
          sender: 'ai',
          text: `Gemini says: "${userMsg.text}"` + (userMsg.image ? ' [Image received]' : ''),
          timestamp: Date.now(),
          image: null,
        },
      ]);
      setTyping(false);
    }, 1200 + Math.random() * 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !img) return;
    const newMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
      timestamp: Date.now(),
      image: img,
    };
    setMessages(msgs => [...msgs, newMsg]);
    setInput('');
    setImg(null);
    sendAIReply(newMsg);
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCopy = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopyTipId(msgId);
    setTimeout(() => setCopyTipId(null), 1000);
  };

  return (
    <div style={styles.container}>
      <div style={{ position: 'relative' }}>
        <button style={styles.backBtn} onClick={onBack} aria-label="Back to Dashboard">⟵</button>
        <div style={styles.header}>Random Chatroom</div>
      </div>
      <div style={styles.messages} ref={messagesRef}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={styles.msgRow}
            onMouseEnter={() => setCopyTipId(msg.id)}
            onMouseLeave={() => setCopyTipId(null)}
          >
            <div
              style={msg.sender === 'user' ? styles.msgUser : styles.msgAI}
              onClick={() => handleCopy(msg.id, msg.text)}
              title="Click to copy"
            >
              {msg.text}
              {msg.image && <img src={msg.image} alt="uploaded" style={styles.imgThumb} />}
              {copyTipId === msg.id && <span style={styles.copyTip}>Copied!</span>}
            </div>
            <span style={styles.timestamp}>{msg.sender === 'ai' ? AI_NAME : 'You'} • {formatTime(msg.timestamp)}</span>
          </div>
        ))}
        {typing && <div style={styles.typing}>{AI_NAME} is typing...</div>}
      </div>
      <form style={styles.inputRow} onSubmit={handleSend}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="img-upload-random"
          onChange={handleImgUpload}
        />
        <label htmlFor="img-upload-random" style={{ cursor: 'pointer', color: '#007bff', fontWeight: 600 }}>
          📷
        </label>
        <button style={styles.sendBtn} type="submit">Send</button>
      </form>
    </div>
  );
}
