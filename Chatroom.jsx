import React, { useState, useRef, useEffect } from 'react';

const AI_NAME = 'Gemini';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.10)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatWindow: {
    background: '#ece5dd',
    borderRadius: 16,
    maxWidth: 480,
    width: '98vw',
    minHeight: 520,
    maxHeight: '95vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #d1d7db',
    fontWeight: 700,
    fontSize: '1.2rem',
    textAlign: 'center',
    background: '#075e54',
    color: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    letterSpacing: 1,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '1.2rem 0.7rem',
    background: '#ece5dd',
  },
  msgRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'relative',
    maxWidth: '90%',
  },
  msgRowAI: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    maxWidth: '90%',
  },
  msgUser: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg,#25d366,#128c7e)',
    color: '#fff',
    borderRadius: '16px 16px 4px 16px',
    padding: '0.7rem 1.1rem',
    fontSize: '1.05rem',
    marginBottom: 2,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    wordBreak: 'break-word',
    maxWidth: '100%',
  },
  msgAI: {
    alignSelf: 'flex-start',
    background: '#fff',
    color: '#222',
    borderRadius: '16px 16px 16px 4px',
    padding: '0.7rem 1.1rem',
    fontSize: '1.05rem',
    marginBottom: 2,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    wordBreak: 'break-word',
    maxWidth: '100%',
  },
  timestamp: {
    fontSize: '0.82rem',
    color: '#888',
    marginTop: 2,
    marginLeft: 4,
    alignSelf: 'flex-end',
  },
  typing: {
    fontStyle: 'italic',
    color: '#888',
    margin: '0.5rem 0',
    fontSize: '1rem',
    alignSelf: 'flex-start',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    padding: '1rem',
    borderTop: '1px solid #d1d7db',
    background: '#f7f7f7',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  input: {
    flex: 1,
    padding: '0.9rem',
    fontSize: '1.05rem',
    border: '1px solid #ccc',
    borderRadius: 8,
    outline: 'none',
    background: '#fff',
  },
  sendBtn: {
    background: 'linear-gradient(135deg,#25d366,#128c7e)',
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
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 16,
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#888',
    cursor: 'pointer',
  },
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chatroom({ chatroom, onClose }) {
  // For General chatroom, always start fresh
  const isGeneral = chatroom.name.toLowerCase() === 'general';
  const [messages, setMessages] = useState(() => isGeneral ? [] : []);
  const [input, setInput] = useState('');
  const [img, setImg] = useState(null);
  const [typing, setTyping] = useState(false);
  const [copyTipId, setCopyTipId] = useState(null);
  const messagesRef = useRef();

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
    <div style={styles.overlay}>
      <div style={styles.chatWindow}>
        <button style={styles.closeBtn} onClick={onClose} title="Close">&times;</button>
        <div style={styles.header}>{chatroom.name} Chatroom</div>
        <div style={styles.messages} ref={messagesRef}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={msg.sender === 'user' ? styles.msgRow : styles.msgRowAI}
              onMouseEnter={() => setCopyTipId(msg.id)}
              onMouseLeave={() => setCopyTipId(null)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                {msg.sender === 'ai' && (
                  <span style={{ fontSize: 24, marginBottom: 2 }}>🤖</span>
                )}
                <div
                  style={msg.sender === 'user' ? styles.msgUser : styles.msgAI}
                  onClick={() => handleCopy(msg.id, msg.text)}
                  title="Click to copy"
                >
                  {msg.text}
                  {msg.image && <img src={msg.image} alt="uploaded" style={styles.imgThumb} />}
                  {copyTipId === msg.id && <span style={styles.copyTip}>Copied!</span>}
                </div>
                {msg.sender === 'user' && (
                  <span style={{ fontSize: 24, marginBottom: 2 }}>🧑</span>
                )}
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
            id="img-upload"
            onChange={handleImgUpload}
          />
          <label htmlFor="img-upload" style={{ cursor: 'pointer', color: '#128c7e', fontWeight: 600, fontSize: 22 }}>
            📎
          </label>
          <button style={styles.sendBtn} type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
