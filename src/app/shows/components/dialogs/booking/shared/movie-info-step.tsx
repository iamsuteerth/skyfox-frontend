import React from 'react';
import {
  Box, VStack, HStack, Text, Badge, Heading, Image,
  FormControl, FormLabel, Input, FormErrorMessage
} from '@chakra-ui/react';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import { formatDuration, formatTimestampToOrdinalDate } from '@/utils/date-utils';
import { DELUXE_OFFSET } from '@/constants';

interface MovieInfoStepProps {
  show: Show;
  numberOfSeats: number;
  onNumberOfSeatsChange: (value: number) => void;
  maxSeats: number;
  seatsError: string;
}

export const MovieInfoStep: React.FC<MovieInfoStepProps> = ({
  show,
  numberOfSeats,
  onNumberOfSeatsChange,
  maxSeats,
  seatsError
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      onNumberOfSeatsChange(0);
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    const numValue = parseInt(value);
    onNumberOfSeatsChange(numValue);
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box
        position="relative"
        height={{ base: "200px", md: "300px" }}
        borderRadius="md"
        overflow="hidden"
      >
        <Image
          src={show.movie.moviePoster || '/placeholder-poster.jpg'}
          alt={show.movie.name}
          objectFit="contain"
          width="100%"
          height="100%"
        />
      </Box>

      <VStack align="start" spacing={4}>
        <Heading size="lg" color="text.primary">{show.movie.name}</Heading>

        <HStack spacing={2} flexWrap="wrap">
          <Badge bg="brand.500" color="white">
            <TimeIcon mr="1" />
            {show.slot.startTime.substring(0, 5)}
          </Badge>
          <Badge bg="secondary" color="text.primary">{show.slot.name}</Badge>
          <Badge bg="success" color="white">
            {formatTimestampToOrdinalDate(show.date)}
          </Badge>
        </HStack>

        <HStack spacing={3} flexWrap="wrap">
          <Badge
            display="flex"
            alignItems="center"
            bg="rgba(0,0,0,0.7)"
            color="white"
          >
            <StarIcon color="gold" mr="1" />
            {show.movie.imdbRating}
          </Badge>
          <Text fontSize="sm" color="text.secondary">{formatDuration(show.movie.duration)}</Text>
          <Text fontSize="sm" color="text.secondary">{show.movie.genre}</Text>
        </HStack>

        <Text color="text.secondary" fontSize="md">{show.movie.plot}</Text>

        <Box w="100%" bg="background.secondary" p={4} borderRadius="md">
          <FormControl isInvalid={!!seatsError}>
            <FormLabel fontWeight="medium" color="text.primary">Number of seats</FormLabel>
            <Input
              value={numberOfSeats || ''}
              onChange={handleInputChange}
              placeholder="Enter number of seats"
              type="text"
              bg="white"
              max={maxSeats}
            />
            {seatsError && (
              <FormErrorMessage>{seatsError}</FormErrorMessage>
            )}
          </FormControl>

          <Text fontSize="sm" color="text.tertiary" mt={2}>
            * Deluxe seats cost an additional ₹{DELUXE_OFFSET} per seat
          </Text>

          <Text fontWeight="bold" mt={4} color="brand.500" fontSize="lg">
            Total: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(show.cost * (numberOfSeats || 0))}
          </Text>
        </Box>
      </VStack>
    </VStack>
  );
};
