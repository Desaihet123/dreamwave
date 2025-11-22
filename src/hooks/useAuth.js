'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('mylogintoken='));
      
      if (!cookie) {
        setUser(null);
        setLoading(false);
        return;
      }

      const tokenData = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      setUser({
        token: tokenData.token,
        role: tokenData.role,
      });
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isManager: user?.role === 'manager',
    isStaff: user?.role === 'staff',
    isAuthenticated: !!user,
  };
}
