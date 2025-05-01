'use client';

import { useState } from "react";

import {
  Box,
  Card,
  CardBody,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  Divider
} from "@chakra-ui/react";

import ManualCheckInTab from "./manual-check-in-tab";
import ScanQRTab from "./scan-qr-tab";

export default function CheckIn() {
  const tabFontSize = useBreakpointValue({ base: "sm", md: "md" });
  const cardPx = useBreakpointValue({ base: 1, sm: 3, md: 6 });
  const cardPy = useBreakpointValue({ base: 2, sm: 4, md: 8 });
  const maxW = useBreakpointValue({ base: "100%", md: "1000px", xl: "1240px" });

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box
      bg="background.primary"
      minH="100vh"
      py={{ base: 2, md: 8 }}
      px={{ base: 0, md: 4 }}
      transition="background 0.3s"
    >
      <Card
        bg="background.primary"
        borderRadius="xl"
        boxShadow="sm"
        maxW={maxW}
        mx="auto"
        my={2}
        borderWidth="1px"
        borderColor="surface.light"
      >
        <CardBody px={cardPx} py={cardPy}>
          <VStack align="stretch" spacing={6}>
            <Heading
              size="lg"
              color="text.primary"
              fontWeight={600}
              lineHeight={1.2}
            >
              Manage Booking Check-In
            </Heading>
            <Divider borderColor="surface.light" />
            <Tabs
              isFitted
              variant="unstyled"
              w="100%"
              index={tabIndex}
              onChange={setTabIndex}
              isLazy
            >
              <TabList
                mb={2}
                borderBottomWidth="1px"
                borderColor="surface.light"
                bg="transparent"
              >
                <Tab
                  fontSize={tabFontSize}
                  color="text.secondary"
                  _selected={{
                    color: "primary",
                    borderBottom: "2px solid",
                    borderColor: "primary",
                    bg: "transparent",
                    fontWeight: "semibold",
                  }}
                  _focus={{ boxShadow: "none" }}
                  bg="transparent"
                >
                  Manual Check-In
                </Tab>
                <Tab
                  fontSize={tabFontSize}
                  color="text.secondary"
                  _selected={{
                    color: "primary",
                    borderBottom: "2px solid",
                    borderColor: "primary",
                    bg: "transparent",
                    fontWeight: "semibold",
                  }}
                  _focus={{ boxShadow: "none" }}
                  bg="transparent"
                >
                  Scan QR
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} py={{ base: 2, md: 4 }} >
                  <ManualCheckInTab />
                </TabPanel>
                <TabPanel px={0} py={{ base: 2, md: 4 }}>
                  <ScanQRTab isActive={tabIndex === 1} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
