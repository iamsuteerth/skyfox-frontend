'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import {
  Box,
  Text,
  Center,
  HStack,
  VStack,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { RiSofaFill } from 'react-icons/ri';
import { GiSofa } from 'react-icons/gi';
import { SeatMap as SeatMapType, Seat } from '@/services/booking-service';
import { SEAT_TYPES } from '@/constants';

interface SeatMapProps {
  showId: number;
  numberOfSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  isLoading?: boolean;
  seatMapData?: SeatMapType;
}

const SeatButton = memo(({
  seat,
  isSelected,
  isHovered,
  onSeatClick,
  onMouseEnter,
  onMouseLeave
}: {
  seat: Seat;
  isSelected: boolean;
  isHovered: boolean;
  onSeatClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const getSeatColor = (): string => {
    if (seat.occupied) return 'tertiary';
    if (isSelected) return 'primary';
    if (isHovered) return 'secondary';
    return seat.type === SEAT_TYPES.STANDARD ? 'surface.light' : 'surface.dark';
  };

  const SeatIcon = seat.type === SEAT_TYPES.STANDARD ? RiSofaFill : GiSofa;

  return (
    <Box
      as="button"
      disabled={seat.occupied}
      onClick={onSeatClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      color={getSeatColor()}
      bg="transparent"
      borderWidth={isSelected ? 2 : 0}
      borderColor="primary"
      borderRadius="md"
      transition="all 0.2s"
      p={1}
      m={1}
      _hover={{
        transform: seat.occupied ? 'none' : 'scale(1.1)',
      }}
      position="relative"
      cursor={seat.occupied ? 'not-allowed' : 'pointer'}
      w="32px"
      h="32px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box as={SeatIcon} size="24px" />
    </Box>
  );
});

SeatButton.displayName = 'SeatButton';

const SeatRow = memo(({ 
  row, 
  seats, 
  selectedSeats, 
  hoveredSeat, 
  onSeatClick,
  onSeatHover,
  onSeatLeave
}: {
  row: string;
  seats: Seat[];
  selectedSeats: string[];
  hoveredSeat: string | null;
  onSeatClick: (seat: Seat) => void;
  onSeatHover: (seatNumber: string) => void;
  onSeatLeave: () => void;
}) => {
  return (
    <Flex mb={2} align="center" justify="center">
      <Text fontWeight="bold" width="30px" textAlign="center">{row}</Text>
      <Flex justify="center" flex={1} wrap="wrap" maxW="700px">
        {seats.map((seat) => (
          <SeatButton
            key={seat.seat_number}
            seat={seat}
            isSelected={selectedSeats.includes(seat.seat_number)}
            isHovered={hoveredSeat === seat.seat_number}
            onSeatClick={() => onSeatClick(seat)}
            onMouseEnter={() => onSeatHover(seat.seat_number)}
            onMouseLeave={onSeatLeave}
          />
        ))}
      </Flex>
      <Text fontWeight="bold" width="30px" textAlign="center">{row}</Text>
    </Flex>
  );
});

SeatRow.displayName = 'SeatRow';

export const SeatMap: React.FC<SeatMapProps> = ({
  numberOfSeats,
  selectedSeats,
  onSeatSelect,
  isLoading = false,
  seatMapData
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const { standardRows, deluxeRows } = useMemo(() => {
    if (!seatMapData) return { standardRows: [], deluxeRows: [] };
    
    return {
      standardRows: Object.keys(seatMapData)
        .filter(row => seatMapData[row][0].type === SEAT_TYPES.STANDARD)
        .sort(),
      deluxeRows: Object.keys(seatMapData)
        .filter(row => seatMapData[row][0].type === SEAT_TYPES.DELUXE)
        .sort()
    };
  }, [seatMapData]);

  const handleSeatClick = useCallback((seat: Seat) => {
    if (seat.occupied) return;

    const seatNumber = seat.seat_number;
    let newSelectedSeats: string[];

    if (selectedSeats.includes(seatNumber)) {
      newSelectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
      if (selectedSeats.length < numberOfSeats) {
        newSelectedSeats = [...selectedSeats, seatNumber];
      } else {
        newSelectedSeats = [...selectedSeats.slice(1), seatNumber];
      }
    }

    onSeatSelect(newSelectedSeats);
  }, [selectedSeats, numberOfSeats, onSeatSelect]);

  const handleSeatHover = useCallback((seatNumber: string) => {
    setHoveredSeat(seatNumber);
  }, []);

  const handleSeatLeave = useCallback(() => {
    setHoveredSeat(null);
  }, []);

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="primary" thickness="4px" />
      </Center>
    );
  }

  if (!seatMapData) {
    return (
      <Center py={10}>
        <Text color="text.secondary">No seat data available</Text>
      </Center>
    );
  }

  return (
    <Box 
      w="100%" 
      overflowX="auto"
      css={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(224, 75, 0, 0.4) rgba(0, 0, 0, 0.1)',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(224, 75, 0, 0.4)',
          borderRadius: '4px',
        }
      }}
    >
      <VStack spacing={6} align="center" w="100%" pb={4}>
        <Box 
          w={{ base: "80%", md: "60%" }}
          h="20px" 
          bg="gray.700" 
          borderRadius="md"
          transform="perspective(200px) rotateX(-10deg)"
          boxShadow="0 0 10px rgba(255,255,255,0.3)"
          mb={4}
        />
        <Text fontSize="sm" color="text.tertiary" mb={2}>All eyes this way</Text>
        
        <Box w="100%" maxW="700px">
          <Text fontWeight="bold" color="text.secondary" mb={2}>Standard Seats</Text>
          {standardRows.map(row => (
            <SeatRow
              key={row}
              row={row}
              seats={seatMapData[row]}
              selectedSeats={selectedSeats}
              hoveredSeat={hoveredSeat}
              onSeatClick={handleSeatClick}
              onSeatHover={handleSeatHover}
              onSeatLeave={handleSeatLeave}
            />
          ))}
        </Box>

        <Box h="40px" />

        <Box w="100%" maxW="700px">
          <Text fontWeight="bold" color="text.secondary" mb={2}>Deluxe Seats</Text>
          {deluxeRows.map(row => (
            <SeatRow
              key={row}
              row={row}
              seats={seatMapData[row]}
              selectedSeats={selectedSeats}
              hoveredSeat={hoveredSeat}
              onSeatClick={handleSeatClick}
              onSeatHover={handleSeatHover}
              onSeatLeave={handleSeatLeave}
            />
          ))}
        </Box>

        <HStack spacing={5} mt={4} flexWrap="wrap" justify="center">
          <HStack>
            <Box as={RiSofaFill} size="20px" color="surface.light" />
            <Text fontSize="sm" color="text.tertiary">Standard</Text>
          </HStack>
          <HStack>
            <Box as={GiSofa} size="20px" color="surface.dark" />
            <Text fontSize="sm" color="text.tertiary">Deluxe</Text>
          </HStack>
          <HStack>
            <Box as={RiSofaFill} size="20px" color="primary" />
            <Text fontSize="sm" color="text.tertiary">Selected</Text>
          </HStack>
          <HStack>
            <Box as={RiSofaFill} size="20px" color="tertiary" />
            <Text fontSize="sm" color="text.tertiary">Occupied</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default memo(SeatMap);