"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((nextUser: User | null) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const login = async () => console.log("Login disabled in Demo Mode");
  const signup = async () => console.log("Signup disabled in Demo Mode");
  const logout = async () => console.log("Logout disabled in Demo Mode");

  return { user, loading, login, signup, logout };
}
