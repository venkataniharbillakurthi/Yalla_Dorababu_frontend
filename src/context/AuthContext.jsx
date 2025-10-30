// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [user, setUser] = useState(null);
  const [keySequence, setKeySequence] = useState([]);
  const secretSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Check token validity on app start
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, []);

  // Auto-logout on token expiry
  useEffect(() => {
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expiry = tokenData.exp * 1000;
        
        if (Date.now() >= expiry) {
          logout();
        }
      } catch (error) {
        console.error('Token parsing error:', error);
        logout();
      }
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch('/api/admin/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUser(data.username);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUser(data.username);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      setToken(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      setKeySequence([]);
    }
  }, [token]);

  const checkKeySequence = useCallback((key) => {
    setKeySequence(prev => {
      const newSequence = [...prev, key].slice(-secretSequence.length);
      const sequenceMatch = newSequence.length === secretSequence.length && 
        newSequence.every((k, i) => k === secretSequence[i]);
      
      if (sequenceMatch) {
        // For hidden access, create a temporary session
        setIsAuthenticated(true);
        setIsAdmin(true);
        return [];
      }
      return newSequence;
    });
  }, [secretSequence]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      login, 
      logout, 
      checkKeySequence, 
      token, 
      user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
