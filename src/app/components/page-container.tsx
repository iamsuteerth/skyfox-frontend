// src/components/ui/page-container.tsx
'use client';

import { Box, Container, Flex, ContainerProps, FlexProps, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  containerProps?: ContainerProps;
  flexProps?: FlexProps;
  boxProps?: BoxProps;
}

export default function PageContainer({ 
  children,
  containerProps,
  flexProps,
  boxProps,
}: PageContainerProps) {
  return (
    <Box 
      minH="100vh" 
      bg="background.primary" 
      py={8}
      {...boxProps}
    >
      <Container 
        maxW="container.xl" 
        h="100%" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        {...containerProps}
      >
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          minH="calc(100vh - 64px)" 
          px={4} 
          w="100%"
          {...flexProps}
        >
          {children}
        </Flex>
      </Container>
    </Box>
  );
}
