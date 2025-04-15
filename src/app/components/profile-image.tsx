'use client';

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Avatar, AvatarProps, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';

type ProfileImageProps = Omit<AvatarProps, 'src'> & {
  fallbackImageSrc?: string;
  onRefreshRequest?: () => void; 
};

const profileImageRefresher = (() => {
  let refreshFunction: (() => void) | null = null;
  let currentTimestamp: number | null = null;
  
  return {
    setRefreshFunction: (fn: () => void) => {
      refreshFunction = fn;
    },
    refreshProfileImage: () => {
      if (refreshFunction) {
        currentTimestamp = Date.now();
        refreshFunction();
      }
    },
    getCurrentTimestamp: () => currentTimestamp
  };
})();

export { profileImageRefresher };

const ProfileImage = memo(({ 
  fallbackImageSrc = '/default_avatars/default_1.jpg',
  onRefreshRequest,
  ...avatarProps 
}: ProfileImageProps) => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const isMounted = useRef(true);
  const [imageKey, setImageKey] = useState<number>(0);

  const imageUrl = token && user 
    ? `/api/profile-image${profileImageRefresher.getCurrentTimestamp() ? `?t=${profileImageRefresher.getCurrentTimestamp()}` : ''}`
    : null;

  const refreshImage = useCallback(() => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    setError(false);
    
    if (onRefreshRequest) {
      onRefreshRequest();
    }
    
    setImageKey(prev => prev + 1);
    
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }, 100);
  }, [onRefreshRequest]);

  useEffect(() => {
    profileImageRefresher.setRefreshFunction(refreshImage);
    
    return () => {
      isMounted.current = false;
    };
  }, [refreshImage]);

  if (isLoading) {
    return (
      <Avatar 
        {...avatarProps} 
        icon={<Spinner size="xs" color="white" />} 
        bg="primary"
      />
    );
  }

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
      key={imageKey} 
      {...avatarProps}
      src={imageUrl}
      name={user?.username || "User"}
      onError={() => setError(true)}
    />
  );
});

ProfileImage.displayName = 'ProfileImage';

export default ProfileImage;
