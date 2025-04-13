import React from 'react';
import { Box, Text, Icon } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';

const NoShows: React.FC = () => {
  return (
    <Box 
      p={6} 
      textAlign="center" 
      borderRadius="lg" 
      bg="background.secondary"
      borderWidth="1px"
      borderColor="surface.light"
      my={4}
    >
      <Icon as={CalendarIcon} boxSize={10} color="brand.500" mb={3} />
      <Text fontSize="xl" fontWeight="medium" color="text.primary" mb={2}>
        No Shows Available
      </Text>
      <Text color="text.tertiary" fontSize="sm">
        There are no shows scheduled for this date.
        <br />
        Please select a different date.
      </Text>
    </Box>
  );
};

export default NoShows;
