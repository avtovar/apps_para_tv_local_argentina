"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if auth is a mock or real
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async () => console.log("Login disabled in Demo Mode");
  const signup = async () => console.log("Signup disabled in Demo Mode");
  const logout = async () => console.log("Logout disabled in Demo Mode");

  return { user, loading, login, signup, logout };
}
