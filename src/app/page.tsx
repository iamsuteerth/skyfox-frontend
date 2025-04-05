'use client';

import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  Button, 
  Input, 
  useColorMode, 
  Switch, 
  Flex, 
  Grid, 
  GridItem, 
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tag,
  VStack,
  HStack
} from '@chakra-ui/react';
import ColorModeSwitcher from '@/app/components/ui/color-mode-switcher';

export default function Home() {
  const { colorMode } = useColorMode();

  return (
    <Box p={8} maxWidth="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Skyfox Theme Preview</Heading>
        <ColorModeSwitcher />
      </Flex>

      <Text mb={8}>
        Current mode: <Badge colorScheme={colorMode === 'dark' ? 'blue' : 'orange'}>{colorMode}</Badge>
      </Text>

      <Grid templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}} gap={8}>
        {/* Typography Section */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Typography</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="xs" variant="quaternary">Text Level: Primary</Text>
                  <Heading size="lg" mb={1}>Heading Text</Heading>
                  <Text variant="primary">Primary text for important content</Text>
                </Box>
                
                <Box>
                  <Text fontSize="xs" variant="quaternary">Text Level: Secondary</Text>
                  <Heading size="md" mb={1}>Secondary Heading</Heading>
                  <Text variant="secondary">Secondary text for regular content</Text>
                </Box>
                
                <Box>
                  <Text fontSize="xs" variant="quaternary">Text Level: Tertiary</Text>
                  <Heading size="sm" mb={1}>Small Heading</Heading>
                  <Text variant="tertiary">Tertiary text for supporting information</Text>
                </Box>
                
                <Box>
                  <Text fontSize="xs" variant="quaternary">Text Level: Quaternary</Text>
                  <Text fontSize="sm" variant="quaternary">Quaternary text for minimal emphasis content like placeholders</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Colors Section */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Brand Colors</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Box p={3} bg="primary.light" _dark={{bg: "primary.dark"}} borderRadius="md">
                  <Text color="white">Primary</Text>
                </Box>
                <Box p={3} bg="secondary.light" _dark={{bg: "secondary.dark"}} borderRadius="md">
                  <Text color={colorMode === 'dark' ? 'white' : 'black'}>Secondary</Text>
                </Box>
                <Box p={3} bg="tertiary.light" _dark={{bg: "tertiary.dark"}} borderRadius="md">
                  <Text color="white">Tertiary</Text>
                </Box>
                <HStack>
                  <Box p={3} bg="success.light" _dark={{bg: "success.dark"}} borderRadius="md" flex="1">
                    <Text color="white">Success</Text>
                  </Box>
                  <Box p={3} bg="error.light" _dark={{bg: "error.dark"}} borderRadius="md" flex="1">
                    <Text color="white">Error</Text>
                  </Box>
                  <Box p={3} bg="info.light" _dark={{bg: "info.dark"}} borderRadius="md" flex="1">
                    <Text color="white">Info</Text>
                  </Box>
                </HStack>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Buttons Section */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Buttons</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="xs" variant="quaternary" mb={2}>Primary Buttons</Text>
                  <HStack spacing={2}>
                    <Button>Primary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </HStack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontSize="xs" variant="quaternary" mb={2}>Status Buttons</Text>
                  <HStack spacing={2}>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="error">Error</Button>
                    <Button variant="info">Info</Button>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Form Controls Section */}
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Form Controls</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="xs" variant="quaternary" mb={1}>Input Field</Text>
                  <Input placeholder="Type something..." />
                </Box>
                
                <Box>
                  <Text fontSize="xs" variant="quaternary" mb={1}>Toggle Switch</Text>
                  <HStack>
                    <Switch defaultChecked />
                    <Text variant="tertiary">Toggle enabled</Text>
                  </HStack>
                </Box>
                
                <Box>
                  <Text fontSize="xs" variant="quaternary" mb={1}>Tags & Badges</Text>
                  <HStack spacing={2}>
                    <Badge variant="tertiary">Badge</Badge>
                    <Tag bg="tertiary.light" _dark={{bg: "tertiary.dark"}} color="white">Tag 1</Tag>
                    <Tag bg="primary.light" _dark={{bg: "primary.dark"}} color="white">Tag 2</Tag>
                    <Tag bg="secondary.light" _dark={{bg: "secondary.dark"}} color={colorMode === 'dark' ? 'white' : 'black'}>Tag 3</Tag>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Surfaces Section */}
        <GridItem colSpan={{base: 1, md: 2}}>
          <Card>
            <CardHeader>
              <Heading size="md">Surface & Background Colors</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns={{base: "1fr", md: "repeat(4, 1fr)"}} gap={4}>
                <Box p={3} bg="background.primary.light" _dark={{bg: "background.primary.dark"}} borderRadius="md" height="100px" display="flex" alignItems="center" justifyContent="center">
                  <Text variant="tertiary">Background Primary</Text>
                </Box>
                <Box p={3} bg="background.secondary.light" _dark={{bg: "background.secondary.dark"}} borderRadius="md" height="100px" display="flex" alignItems="center" justifyContent="center">
                  <Text variant="tertiary">Background Secondary</Text>
                </Box>
                <Box p={3} bg="surface.light.light" _dark={{bg: "surface.light.dark"}} borderRadius="md" height="100px" display="flex" alignItems="center" justifyContent="center">
                  <Text variant="tertiary">Surface Light</Text>
                </Box>
                <Box p={3} bg="surface.dark.light" _dark={{bg: "surface.dark.dark"}} borderRadius="md" height="100px" display="flex" alignItems="center" justifyContent="center">
                  <Text variant="tertiary" color="white">Surface Dark</Text>
                </Box>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}
