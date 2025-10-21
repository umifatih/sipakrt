'use client';
import { createContext, useContext, useState } from 'react';

const AccessCtx = createContext<{ isAdmin: boolean; setIsAdmin: (v: boolean) => void }>({
  isAdmin: false,
  setIsAdmin: () => {},
});

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  return <AccessCtx.Provider value={{ isAdmin, setIsAdmin }}>{children}</AccessCtx.Provider>;
}

export const useAccess = () => useContext(AccessCtx);
