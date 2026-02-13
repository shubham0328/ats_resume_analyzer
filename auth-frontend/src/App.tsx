import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard' | 'success'>('login');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setView('dashboard');
      }
    } catch {
      localStorage.removeItem('token');
    }
  };

  const handleAuthSuccess = (newToken: string, message: string) => {
    setSuccessMessage(message);
    setView('success');
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setTimeout(() => {
      fetchUser(newToken);
    }, 2000); // 2s success animation
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setView('login');
  };

  if (view === 'success') {
    return (
      <div className="success-bg min-h-screen flex items-center justify-center p-8">
        <div className="success-card animate-explode-in">
          <div className="success-checkmark animate-bounce-scale">
            <svg className="w-28 h-28 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-6 animate-slide-up">
            Perfect!
          </h1>
          <p className="text-xl text-gray-700 mb-10 font-semibold animate-slide-up-delay">{successMessage}</p>
          <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl animate-spin-slow mx-auto shadow-2xl"></div>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="app-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {view === 'login' ? (
          <Login onSuccess={handleAuthSuccess} onSwitch={() => setView('register')} />
        ) : (
          <Register onSuccess={handleAuthSuccess} onSwitch={() => setView('login')} />
        )}
      </div>
    </div>
  );
}

export default App;
