import React, { useState } from 'react';

interface Props {
  onSuccess: (token: string, message: string) => void;
  onSwitch: () => void;
}

const Login: React.FC<Props> = ({ onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.email);
      formDataToSend.append('password', formData.password);

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      onSuccess(data.access_token, 'Login successful! Redirecting...');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 animate-float-in">
      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Welcome Back
          </h1>
          <p className="text-xl text-gray-600 font-medium">Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-alert animate-shake">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span className="font-medium text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              required
              className="auth-input"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              required
              className="auth-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button group" 
            disabled={loading}
          >
            <span className="flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin-slow"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Switcher */}
        <div className="mt-10 pt-8 border-t border-gray-200/50 text-center">
          <p className="text-lg text-gray-600 mb-2">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline text-lg transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
