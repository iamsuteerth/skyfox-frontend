import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Badge, 
  Button,
  Tooltip,
  HStack,
  VStack,
  Icon
} from '@chakra-ui/react';
import Image from 'next/image';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import { formatDuration } from '@/utils/date-utils';

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const formattedCost = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,  
    maximumFractionDigits: 2
  }).format(show.cost);

  const startTime = show.slot.startTime.substring(0, 5);
  
  const formattedDuration = formatDuration(show.movie.duration);
  
  const shortGenre = show.movie.genre.split(', ').slice(0, 2).join(', ');
  const hasMoreGenres = show.movie.genre.split(', ').length > 2;
  
  return (
    <Box 
      w="300px"
      minW="300px"
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg="background.primary"
      borderColor="surface.light"
      shadow="sm"  
      transition="all 0.3s"
      _hover={{ 
        shadow: "md",  
        transform: 'translateY(-3px)',
        borderColor: 'brand.300'
      }}
      mr={6}
      pb={1}
    >
      <Box position="relative" h="200px" w="full">
        <Image
          src={show.movie.moviePoster}
          alt={show.movie.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="300px"
          priority
        />
        
        <Box 
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="70px"
          bgGradient="linear(to-b, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)"
        />
        
        <Box 
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="100px"
          bgGradient="linear(to-t, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)"
        />
        
        <Flex
          position="absolute"
          top={3}
          right={3}
          align="center"
          bg="rgba(0,0,0,0.7)"
          color="white"
          borderRadius="md"
          px={2}
          py={1}
          fontSize="sm"
        >
          <Icon as={StarIcon} color="gold" mr={1} boxSize={3} />  
          <Text fontWeight="bold" color="background.primary">{show.movie.imdbRating}</Text>
        </Flex>
        
        <Flex
          position="absolute"
          bottom={3}
          left={3}
          right={3}
          justify="space-between"
          align="center"
        >
          <Badge colorScheme='brand' variant="solid" px={2} py={1}>
            {show.slot.name}
          </Badge>
          
          <HStack 
            spacing={1} 
            bg="rgba(0,0,0,0.7)"  
            color="white"
            px={2}
            py={1}
            borderRadius="md"
          >
            <Icon as={TimeIcon} boxSize={3} color="background.primary" /> 
            <Text fontSize="sm" fontWeight="medium" color="background.primary">
              {startTime}
            </Text>
          </HStack>
        </Flex>
      </Box>
      
      <VStack align="stretch" spacing={3} p={4} pt={3}>
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          color="text.primary"
          noOfLines={1}
          lineHeight="tight"
        >
          {show.movie.name}
        </Text>
        
        <HStack spacing={1}>
          <Text fontSize="sm" color="text.tertiary" noOfLines={1}>
            {formattedDuration} • {shortGenre}
            {hasMoreGenres && (
              <Tooltip 
                label={show.movie.genre}
                placement="top" 
                hasArrow
                bg="background.secondary"
                color="text.primary"
              >
                <Text as="span" cursor="pointer" color="brand.400"> +more</Text>
              </Tooltip>
            )}
          </Text>
        </HStack>
        
        <Tooltip 
          label={show.movie.plot} 
          placement="bottom" 
          hasArrow
          bg="background.secondary"
          color="text.primary"
          openDelay={300}
        >
          <Text 
            noOfLines={2} 
            fontSize="sm" 
            color="text.secondary"
            minH="40px"
            cursor="pointer"
          >
            {show.movie.plot}
          </Text>
        </Tooltip>
        
        <Flex justify="space-between" align="center" mt={1}>
          <Text fontSize="sm" color="text.tertiary">
            <Text as="span" fontWeight="semibold" color={show.availableseats > 20 ? "green.500" : "red.500"}>
              {show.availableseats}
            </Text> seats left
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="brand.500">
            {formattedCost}
          </Text>
        </Flex>
        
        <Button
          bg="brand.500"
          color="white"
          size="md"
          borderRadius="md"
          width="100%"
          mt={1}
          fontWeight="medium"
          isDisabled={show.availableseats === 0}
          _hover={{
            bg: "brand.600",
          }}
          _active={{
            bg: "brand.700",
            transform: 'scale(0.98)'
          }}
          _disabled={{
            bg: "gray.300",
            cursor: "not-allowed",
            opacity: 0.7
          }}
        >
          Book Now
        </Button>
      </VStack>
    </Box>
  );
};

export default ShowCard;
