import React from 'react';
import { Box, Flex, Skeleton, SkeletonText } from '@chakra-ui/react';

interface LoadingStateProps {
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ count = 4 }) => {
  return (
    <Box
      position="relative"
      width="full"
      overflow="hidden" 
    >
      <Flex 
        overflowX="auto"
        py={2}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none', 
          },
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          scrollBehavior: 'smooth',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            w="280px"
            minW="280px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="background.primary"
            borderColor="surface.light"
            shadow="sm"
            mx={2}
          >
            <Skeleton height="180px" width="100%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
        
            <Box p={3}>
              <Flex justify="space-between" mb={2}>
                <Skeleton height="20px" width="70%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
                <Skeleton height="20px" width="20%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              </Flex>
              
              <Skeleton height="16px" width="60%" mb={2} startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              
              <SkeletonText mt={2} noOfLines={2} spacing={2} skeletonHeight="10px" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              
              <Flex justify="space-between" align="center" mt={3}>
                <Skeleton height="16px" width="30%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
                <Skeleton height="20px" width="25%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default LoadingState;
