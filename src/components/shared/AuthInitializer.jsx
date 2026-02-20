'use client';
import { useAuth } from '@/hooks/useAuth';

const AuthInitializer = ({ children }) => {
  const { } = useAuth();

  return children;
}

export default AuthInitializer