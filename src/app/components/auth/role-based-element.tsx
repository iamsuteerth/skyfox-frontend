import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface RoleBasedElementProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedElement: React.FC<RoleBasedElementProps> = ({
  allowedRoles,
  children,
  fallback = null
}) => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!user && allowedRoles.includes(user.role));
    return () => setIsVisible(false);
  }, [user, allowedRoles]);

  if (!isVisible) return fallback;
  return <>{children}</>;
};
