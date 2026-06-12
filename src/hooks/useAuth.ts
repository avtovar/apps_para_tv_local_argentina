"use client";

import { useState } from 'react';

export function useAuth() {
  // Siempre devolvemos un usuario simulado para acceso directo
  const [user] = useState({
    uid: "demo-user",
    email: "invitado@argentinatv.live",
    displayName: "Invitado"
  });
  const [loading] = useState(false);

  const login = async () => Promise.resolve();
  const signup = async () => Promise.resolve();
  const logout = async () => Promise.resolve();

  return { user, loading, login, signup, logout };
}
