"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export function useAuth() {
  // Siempre devolvemos un usuario simulado para acceso directo
  const [user, setUser] = useState<any>({
    uid: "demo-user",
    email: "invitado@argentinatv.live",
    displayName: "Invitado"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No necesitamos suscribirnos a cambios de auth real
    setLoading(false);
  }, []);

  const login = async () => Promise.resolve();
  const signup = async () => Promise.resolve();
  const logout = async () => Promise.resolve();

  return { user, loading, login, signup, logout };
}
