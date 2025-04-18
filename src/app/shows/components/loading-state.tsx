import React from 'react';
import {
  Box,
  Flex,
  Skeleton,
  SkeletonText,
  VStack,
  HStack
} from '@chakra-ui/react';

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
            w="300px"
            minW="300px"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            bg="background.primary"
            borderColor="surface.light"
            shadow="sm"
            mr={6}
            pb={1}
          >
            <Box position="relative" h="200px" w="full">
              <Skeleton height="200px" width="100%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />

              <Flex
                position="absolute"
                top={3}
                right={3}
                align="center"
                bg="rgba(0,0,0,0.3)"
                borderRadius="md"
                px={2}
                py={1}
              >
                <Skeleton height="16px" width="40px" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              </Flex>

              <Flex
                position="absolute"
                bottom={3}
                left={3}
                right={3}
                justify="space-between"
                align="center"
              >
                <Skeleton height="24px" width="80px" startColor="surface.light" endColor="surface.dark" opacity="0.2" borderRadius="md" />
                <Skeleton height="24px" width="60px" startColor="surface.light" endColor="surface.dark" opacity="0.2" borderRadius="md" />
              </Flex>
            </Box>

            <VStack align="stretch" spacing={3} p={4} pt={3}>
              <Skeleton height="24px" width="80%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />

              <HStack spacing={1}>
                <Skeleton height="16px" width="90%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              </HStack>

              <Box minH="40px">
                <SkeletonText mt={1} noOfLines={2} spacing={2} skeletonHeight="10px" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              </Box>

              <Flex justify="space-between" align="center" mt={1}>
                <Skeleton height="16px" width="40%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
                <Skeleton height="24px" width="25%" startColor="surface.light" endColor="surface.dark" opacity="0.2" />
              </Flex>

              <Skeleton
                height="40px"
                width="100%"
                startColor="surface.light"
                endColor="surface.dark"
                opacity="0.2"
                borderRadius="md"
                mt={1}
              />
            </VStack>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default LoadingState;
