import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginWithOTP from './LoginWithOTP.jsx';
import Dashboard from './Dashboard.jsx';
import RandomChatroom from './RandomChatroom.jsx';
import { ThemeProvider, useTheme } from './ThemeContext.jsx';

function DarkModeToggle() {
  const { dark, setDark } = useTheme();
  return (
    <button
      aria-label="Toggle dark mode"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 2000,
        background: 'none',
        border: 'none',
        fontSize: 24,
        cursor: 'pointer',
        color: 'var(--text-color, #222)'
      }}
      onClick={() => setDark(d => !d)}
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDark(d => !d)}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);
  const [showRandom, setShowRandom] = useState(false);
  return (
    <>
      <DarkModeToggle />
      <Routes>
        <Route path="/" element={<LoginWithOTP onLogin={() => setIsLoggedIn(true)} />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard onOpenRandom={() => setShowRandom(true)} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/random-chatroom"
          element={isLoggedIn ? <RandomChatroom onBack={() => window.history.back()} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
