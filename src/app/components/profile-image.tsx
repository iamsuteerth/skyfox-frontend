'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Avatar, AvatarProps, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';

type ProfileImageProps = Omit<AvatarProps, 'src'> & {
  fallbackImageSrc?: string;
  onRefreshRequest?: () => void; 
};

export default function ProfileImage({ 
  fallbackImageSrc = '/default_avatars/default_1.jpg',
  onRefreshRequest,
  ...avatarProps 
}: ProfileImageProps) {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const refreshTimestampRef = useRef<number | null>(null);

  const refreshImage = useCallback(() => {
    setIsLoading(true);
    setError(false);
    refreshTimestampRef.current = Date.now();
    
    if (onRefreshRequest) {
      onRefreshRequest();
    }
    forceUpdate();
  }, [onRefreshRequest]);

  const [, setForceUpdate] = useState({});
  const forceUpdate = useCallback(() => setForceUpdate({}), []);

  useEffect(() => {
    profileImageRefresher.setRefreshFunction(refreshImage);
    
    return () => {
      profileImageRefresher.setRefreshFunction(() => {});
    };
  }, [refreshImage]);

  useEffect(() => {
    if (!token || !user) {
      setError(true);
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [token, user]);

  if (isLoading) {
    return (
      <Avatar 
        {...avatarProps} 
        icon={<Spinner size="xs" color="white" />} 
        bg="primary"
      />
    );
  }

  if (error || !token || !user) {
    return (
      <Avatar
        {...avatarProps}
        name={user?.username || "User"}
        src={fallbackImageSrc}
        bg="primary"
        color="white"
      />
    );
  }

  const proxyImageUrl = refreshTimestampRef.current 
    ? `/api/profile-image?t=${refreshTimestampRef.current}`
    : `/api/profile-image`;

  return (
    <Avatar
      {...avatarProps}
      src={proxyImageUrl}
      name={user?.username || "User"}
      onError={() => setError(true)}
    />
  );
}

export const createProfileImageRefresher = () => {
  let refreshFunction: (() => void) | null = null;
  
  return {
    setRefreshFunction: (fn: () => void) => {
      refreshFunction = fn;
    },
    refreshProfileImage: () => {
      if (refreshFunction) {
        refreshFunction();
      }
    }
  };
};

export const profileImageRefresher = createProfileImageRefresher();
