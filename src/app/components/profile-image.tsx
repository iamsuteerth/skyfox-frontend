'use client';

import { useState, useEffect, memo } from 'react';
import { Avatar, AvatarProps, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';

type ProfileImageProps = Omit<AvatarProps, 'src'> & {
  fallbackImageSrc?: string;
};

export const profileImageRefresher = (() => {
  let globalTimestamp = localStorage.getItem('profileImageTimestamp') 
    ? Number(localStorage.getItem('profileImageTimestamp')) 
    : null;
    
  const listeners = new Set<() => void>();
  
  return {
    addListener: (listener: () => void): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    refreshProfileImage: () => {
      globalTimestamp = Date.now();
      localStorage.setItem('profileImageTimestamp', globalTimestamp.toString());
      listeners.forEach(listener => listener());
    },
    getTimestamp: () => globalTimestamp
  };
})();

const ProfileImage = memo(({ 
  fallbackImageSrc = '/default_avatars/default_1.jpg',
  ...avatarProps 
}: ProfileImageProps) => {
  const { user, token } = useAuth();
  const [error, setError] = useState(false);
  const [localTimestamp, setLocalTimestamp] = useState<number | null>(profileImageRefresher.getTimestamp());
  
  useEffect(() => {
    const unsubscribe = profileImageRefresher.addListener(() => {
      setLocalTimestamp(profileImageRefresher.getTimestamp());
    });
    
    return unsubscribe;
  }, []);

  const imageUrl = token && user 
    ? `/api/profile-image${localTimestamp ? `?t=${localTimestamp}` : ''}`
    : null;

  if (error || !token || !user || !imageUrl) {
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

  return (
    <Avatar
      {...avatarProps}
      src={imageUrl}
      name={user?.username || "User"}
      onError={() => setError(true)}
    />
  );
});

export default ProfileImage;