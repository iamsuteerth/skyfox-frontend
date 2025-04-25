import React, { useRef } from 'react';
import {
  Box,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import ShowCard from './show-card';
import { useAuth } from '@/contexts/auth-context';

interface ShowsGridProps {
  shows: Show[];
}

const ShowsGrid: React.FC<ShowsGridProps> = ({ shows }) => {
  const { user } = useAuth();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <Box position="relative" width="full">
      <IconButton
        variant="ghost"
        aria-label="Scroll left"
        icon={<ChevronLeftIcon boxSize={6} />}
        position="absolute"
        left={-4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        rounded="full"
        size="sm"
        onClick={() => handleScroll('left')}
      />

      <Box
        ref={scrollContainerRef}
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
        py={2}
      >
        <Flex>
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </Flex>
      </Box>

      <IconButton
        variant="ghost"
        aria-label="Scroll right"
        icon={<ChevronRightIcon boxSize={6} />}
        position="absolute"
        right={-4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        rounded="full"
        size="sm"
        onClick={() => handleScroll('right')}
      />
    </Box>
  );
};

export default ShowsGrid;
