import { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginService, register as registerService, clearToken, getToken } from '../services/authService';

function parseTokenPayload(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.user ?? null;
  } catch {
    return null;
  }
}

function getInitialUser() {
  const token = getToken();
  if (!token) return null;
  return parseTokenPayload(token);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = useCallback(async (credentials) => {
    const data = await loginService(credentials);
    setUser(parseTokenPayload(data.authToken));
    return data;
  }, []);

  const register = useCallback(async (details) => {
    const data = await registerService(details);
    setUser(parseTokenPayload(data.authToken));
    return data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}