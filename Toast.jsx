import React, { useEffect } from 'react';

const styles = {
  toast: {
    position: 'fixed',
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    minWidth: 220,
    padding: '1rem 2rem',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    zIndex: 9999,
    boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  success: { background: '#43a047' },
  info: { background: '#1976d2' },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    marginLeft: 8,
  },
};

function Toast({ type = 'info', message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ ...styles.toast, ...styles[type] }}>
      <span>{message}</span>
      <button style={styles.closeBtn} onClick={onClose}>&times;</button>
    </div>
  );
}

export default Toast;
