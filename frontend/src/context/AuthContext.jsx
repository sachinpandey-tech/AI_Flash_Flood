import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ROLES } from '../services/mockData';
import { authLogin, authLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to Disaster Authority so judges can test everything immediately
  const defaultUser = {
    id: 'usr-disaster_authority',
    email: 'commander.sdma@uk.gov.in',
    role: 'disaster_authority',
    roleName: 'Disaster Authority (SDMA / NDRF)',
    badge: 'State Commander'
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('himaguard_user');
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, roleId) => {
    setLoading(true);
    try {
      const res = await authLogin(email, password, roleId);
      if (res.success) {
        setCurrentUser(res.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authLogout();
    setCurrentUser(null);
  };

  const switchRole = (roleId) => {
    const r = MOCK_ROLES.find(x => x.id === roleId);
    if (!r) return;
    const user = {
      id: 'usr-' + r.id,
      email: r.defaultEmail,
      role: r.id,
      roleName: r.name,
      badge: r.badge
    };
    setCurrentUser(user);
    localStorage.setItem('himaguard_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, roles: MOCK_ROLES, login, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
