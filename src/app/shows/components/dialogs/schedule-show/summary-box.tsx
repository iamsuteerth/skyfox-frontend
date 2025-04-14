import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Movie, Slot } from './types';

interface SummaryBoxProps {
  selectedMovie: string | null;
  selectedDate: Date | null;
  selectedSlot: number | null;
  movies: Movie[];
  slots: Slot[];
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({
  selectedMovie,
  selectedDate,
  selectedSlot,
  movies,
  slots
}) => {
  if (!selectedMovie) return null;
  
  const movie = movies.find(m => m.movieId === selectedMovie);
  const slot = selectedSlot ? slots.find(s => s.id === selectedSlot) : null;
  
  return (
    <Box 
      mt={2} 
      p={4} 
      borderWidth="1px" 
      borderRadius="md" 
      borderColor="surface.light" 
      bg="background.secondary"
    >
      <Text fontSize="sm" color="text.tertiary">
        You are scheduling <Text as="span" fontWeight="bold" color="text.primary">{movie?.name}</Text> for{' '}
        <Text as="span" fontWeight="bold" color="text.primary">
          {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        {slot && (
          <> at <Text as="span" fontWeight="bold" color="text.primary">
            {slot.name} ({slot.startTime.substring(0, 5)})
          </Text>
          </>
        )}
      </Text>
    </Box>
  );
};
