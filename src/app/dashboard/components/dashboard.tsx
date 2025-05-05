'use client';

import { useState } from "react";
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Button,
  Flex
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("weekly");
  
  const downloadCSV = () => {
    console.log("Downloading CSV report...");
  };
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl" color="text.primary">Dashboard</Heading>
        <Button 
          leftIcon={<DownloadIcon />} 
          colorScheme="teal" 
          onClick={downloadCSV}
        >
          Download Report
        </Button>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={8}>
        <Stat bg="surface.primary" p={5} borderRadius="md" boxShadow="md">
          <StatLabel color="text.secondary">Total Revenue</StatLabel>
          <StatNumber color="text.primary">₹243,500</StatNumber>
          <StatHelpText color="green.500">+14.3% from last week</StatHelpText>
        </Stat>
        
        <Stat bg="surface.primary" p={5} borderRadius="md" boxShadow="md">
          <StatLabel color="text.secondary">Tickets Sold</StatLabel>
          <StatNumber color="text.primary">1,245</StatNumber>
          <StatHelpText color="green.500">+7.5% from last week</StatHelpText>
        </Stat>
        
        <Stat bg="surface.primary" p={5} borderRadius="md" boxShadow="md">
          <StatLabel color="text.secondary">Occupancy Rate</StatLabel>
          <StatNumber color="text.primary">74.3%</StatNumber>
          <StatHelpText color="red.500">-2.1% from last week</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      <Box bg="surface.primary" p={5} borderRadius="md" boxShadow="md">
        <Tabs colorScheme="teal" onChange={(index) => setTimeRange(["daily", "weekly", "monthly"][index])}>
          <TabList>
            <Tab>Daily</Tab>
            <Tab>Weekly</Tab>
            <Tab>Monthly</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <Box h="400px" display="flex" alignItems="center" justifyContent="center" color="text.primary">
                Revenue chart for daily view will appear here
              </Box>
            </TabPanel>
            <TabPanel>
              <Box h="400px" display="flex" alignItems="center" justifyContent="center" color="text.primary">
                Revenue chart for weekly view will appear here
              </Box>
            </TabPanel>
            <TabPanel>
              <Box h="400px" display="flex" alignItems="center" justifyContent="center" color="text.primary">
                Revenue chart for monthly view will appear here
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
