// src/components/AdminLogin.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, checkKeySequence } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard sequence for hidden access
  useEffect(() => {
    const handleKeyDown = (e) => {
      checkKeySequence(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkKeySequence]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
        <h2 className="text-3xl font-extrabold text-orange-600 text-center mb-6 tracking-tight">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50 text-gray-900 placeholder-gray-400 transition"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50 text-gray-900 placeholder-gray-400 transition"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm text-center border border-red-200">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg bg-orange-600 text-white font-bold shadow hover:bg-orange-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-orange-600 hover:underline">Go to Home</a>
        </div>
       
      </div>
    </div>
  );
};

export default AdminLogin;