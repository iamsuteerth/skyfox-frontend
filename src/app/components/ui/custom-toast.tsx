'use client';

import { useToast, UseToastOptions, Box, Text } from '@chakra-ui/react';
import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface CustomToastOptions extends Omit<UseToastOptions, 'status' | 'render'> {
  type: ToastType;
  title?: string;
  description?: string;
}

export function useCustomToast() {
  const toast = useToast();

  const showToast = useCallback(
    ({ type, title, description, ...rest }: CustomToastOptions) => {
      const bgColor =
        type === 'success' ? '#228B22' : 
          type === 'error' ? '#D42158' :  
            type === 'info' ? '#6495ED' :   
              '#E04B00';                     

      toast({
        position: 'bottom',
        duration: 3000,
        isClosable: true,
        ...rest,
        render: () => (
          <Box
            color="white"
            p={4}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="lg"
            maxW="400px"
            width="100%"
          >
            {title && (
              <Text fontWeight="bold" fontSize="md" mb={description ? 1 : 0} textColor='background.primary'>
                {title}
              </Text>
            )}
            {description && (
              <Text fontSize="sm" textColor='background.primary'>
                {description}
              </Text>
            )}
          </Box>
        ),
      });
    },
    [toast]
  );

  return { showToast };
}
