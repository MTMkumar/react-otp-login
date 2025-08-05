import React, { useState } from 'react';
import Toast from './Toast.jsx';
import Chatroom from './Chatroom.jsx';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 500,
    margin: '5vh auto',
    padding: '2rem',
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minHeight: '50vh',
    width: '90vw',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1.6rem',
    marginBottom: 0,
    color: '#222',
  },
  chatList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    border: '1px solid #eee',
    borderRadius: 8,
    background: '#fafafa',
    minHeight: 80,
  },
  chatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0.5rem',
    borderBottom: '1px solid #eee',
  },
  chatName: {
    fontWeight: 500,
    fontSize: '1.1rem',
  },
  openBtn: {
    background: '#43a047',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontWeight: 600,
    marginLeft: 8,
  },
  deleteBtn: {
    background: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontWeight: 600,
    marginLeft: 8,
  },
  form: {
    display: 'flex',
    gap: 8,
    marginTop: 16,
  },
  input: {
    flex: 1,
    padding: '0.7rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: 6,
    outline: 'none',
  },
  addBtn: {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.7rem 1.2rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    padding: '1.5rem 0',
    fontStyle: 'italic',
  },
  randomBtn: {
    background: 'linear-gradient(90deg,#007bff,#43a047)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.7rem 1.5rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    margin: '1rem auto 0',
    display: 'block',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    letterSpacing: 1,
  },
};

function Dashboard() {
  const [chatrooms, setChatrooms] = useState([
    { id: 1, name: 'General' },
    { id: 2, name: 'Random' },
  ]);
  const [newChat, setNewChat] = useState('');
  const [toast, setToast] = useState(null);
  const [activeChatroom, setActiveChatroom] = useState(null);
  const navigate = useNavigate();

  const handleAddChatroom = (e) => {
    e.preventDefault();
    if (!newChat.trim()) return;
    setChatrooms([...chatrooms, { id: Date.now(), name: newChat.trim() }]);
    setToast({ type: 'success', message: 'Chatroom created!' });
    setNewChat('');
  };

  const handleDeleteChatroom = (id) => {
    setChatrooms(chatrooms.filter(c => c.id !== id));
    setToast({ type: 'info', message: 'Chatroom deleted.' });
    if (activeChatroom && activeChatroom.id === id) setActiveChatroom(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>
      <h3 style={{ textAlign: 'center', margin: 0 }}>Your Chatrooms</h3>
      <ul style={styles.chatList}>
        {chatrooms.length === 0 ? (
          <li style={styles.empty}>No chatrooms found. Create one below!</li>
        ) : (
          chatrooms.map(chat => (
            <li key={chat.id} style={styles.chatItem}>
              <span style={styles.chatName}>{chat.name}</span>
              <div>
                {chat.name.toLowerCase() === 'random' ? (
                  <button
                    style={styles.openBtn}
                    onClick={() => navigate('/random-chatroom')}
                    title="Open Random Chatroom"
                  >
                    Open
                  </button>
                ) : (
                  <button
                    style={styles.openBtn}
                    onClick={() => setActiveChatroom(chat)}
                    title="Open chatroom"
                  >
                    Open
                  </button>
                )}
                <button
                  style={styles.deleteBtn}
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteChatroom(chat.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <form style={styles.form} onSubmit={handleAddChatroom}>
        <input
          style={styles.input}
          type="text"
          placeholder="New chatroom name"
          value={newChat}
          onChange={e => setNewChat(e.target.value)}
        />
        <button style={styles.addBtn} type="submit">Add</button>
      </form>
      <button style={styles.randomBtn} onClick={() => navigate('/random-chatroom')}>
        Go to Random Chatroom
      </button>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      {activeChatroom && (
        <Chatroom chatroom={activeChatroom} onClose={() => setActiveChatroom(null)} />
      )}
    </div>
  );
}

export default Dashboard;
