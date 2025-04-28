'use client';

import { useState } from "react";
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Flex,
  Badge
} from "@chakra-ui/react";
import { SearchIcon, CheckIcon } from "@chakra-ui/icons";

export default function CheckIn() {
  const [ticketId, setTicketId] = useState("");
  const [scanning, setScanning] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handleManualCheck = () => {
    // Implementation for manual check-in
    console.log("Checking in ticket:", ticketId);
    onOpen();
  };
  
  const startScanning = () => {
    setScanning(true);
    // Implementation for QR scanning would go here
    // After scanning is complete:
    // setScanning(false);
    // onOpen(); // Open the modal with ticket info
  };
  
  const completeCheckIn = () => {
    onClose();
    setTicketId("");
  };
  
  return (
    <Box>
      <Heading as="h1" size="xl" color="text.primary" mb={8}>Ticket Check-In</Heading>
      
      <Tabs colorScheme="teal">
        <TabList>
          <Tab>Manual Check-In</Tab>
          <Tab>Scan QR Code</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="flex-start">
              <Text color="text.primary">Enter ticket ID or booking reference:</Text>
              <HStack w="full">
                <Input 
                  placeholder="Ticket ID or reference number" 
                  value={ticketId} 
                  onChange={(e) => setTicketId(e.target.value)}
                  bg="surface.input"
                  color="text.primary"
                  flex="1"
                />
                <Button 
                  leftIcon={<SearchIcon />} 
                  colorScheme="teal" 
                  onClick={handleManualCheck}
                  isDisabled={!ticketId.trim()}
                >
                  Verify
                </Button>
              </HStack>
            </VStack>
          </TabPanel>
          
          <TabPanel>
            <Box textAlign="center" py={8}>
              {!scanning ? (
                <VStack spacing={6}>
                  <Text color="text.primary">Click below to activate camera and scan ticket QR code</Text>
                  <Button 
                    colorScheme="teal" 
                    size="lg" 
                    onClick={startScanning}
                  >
                    Start Scanning
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={6}>
                  <Box 
                    border="2px dashed" 
                    borderColor="teal.500" 
                    w="300px" 
                    h="300px" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Text color="text.primary">Camera feed will appear here</Text>
                  </Box>
                  <Button colorScheme="red" onClick={() => setScanning(false)}>
                    Cancel Scanning
                  </Button>
                </VStack>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Ticket Verification Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="surface.primary">
          <ModalHeader color="text.primary">Ticket Verification</ModalHeader>
          <ModalCloseButton color="text.primary" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box bg="surface.secondary" p={4} borderRadius="md">
                <Flex justify="space-between" mb={2}>
                  <Text color="text.secondary" fontWeight="bold">Movie:</Text>
                  <Text color="text.primary">Avengers: Endgame</Text>
                </Flex>
                <Flex justify="space-between" mb={2}>
                  <Text color="text.secondary" fontWeight="bold">Date & Time:</Text>
                  <Text color="text.primary">27 Apr, 2025 - 7:30 PM</Text>
                </Flex>
                <Flex justify="space-between" mb={2}>
                  <Text color="text.secondary" fontWeight="bold">Seats:</Text>
                  <Text color="text.primary">C4, C5</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="text.secondary" fontWeight="bold">Status:</Text>
                  <Badge colorScheme="green">Valid</Badge>
                </Flex>
              </Box>
              
              <Text color="text.primary" fontWeight="bold" textAlign="center">
                Ticket is valid and ready for check-in
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              leftIcon={<CheckIcon />} 
              onClick={completeCheckIn}
            >
              Complete Check-In
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
