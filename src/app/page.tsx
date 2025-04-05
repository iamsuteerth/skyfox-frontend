'use client';

import { Box, Heading, Text, Stack, Button, Input, useColorMode, Switch, Flex } from '@chakra-ui/react';
import ColorModeSwitcher from '@/app/components/ui/color-mode-switcher';

export default function Home() {
  const { colorMode } = useColorMode();

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Skyfox Theme Preview</Heading>
        <ColorModeSwitcher />
      </Flex>

      <Stack spacing={6}>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.500">
            Current mode: {colorMode}
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>Typography</Heading>
          <Text fontSize="2xl">This is 2xl text.</Text>
          <Text fontSize="lg">This is large body text.</Text>
          <Text>This is normal body text.</Text>
          <Text fontSize="sm">This is small text.</Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>Buttons</Heading>
          <Stack direction="row">
            <Button colorScheme="brand">Primary</Button>
            <Button variant="outline" colorScheme="brand">Outline</Button>
            <Button variant="ghost" colorScheme="brand">Ghost</Button>
          </Stack>
        </Box>

        <Box>
          <Heading size="md" mb={2}>Inputs</Heading>
          <Stack spacing={3}>
            <Input placeholder="Type something..." />
            <Switch colorScheme="brand" defaultChecked>
              Toggle
            </Switch>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
