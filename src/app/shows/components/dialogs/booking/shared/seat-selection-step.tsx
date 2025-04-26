'use client';

import React, { useState, useEffect } from 'react';

import { VStack, Text, Box } from '@chakra-ui/react';

import SeatMap from './seat-map';

import { getSeatMap, SeatMap as SeatMapType } from '@/services/booking-service';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { SEAT_TYPES } from '@/constants';

interface SeatSelectionStepProps {
  showId: number;
  numberOfSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  onPriceUpdate?: (totalPrice: number, deluxeCount: number) => void;
  baseSeatPrice: number;
  deluxeOffset: number;
}

export const SeatSelectionStep: React.FC<SeatSelectionStepProps> = ({
  showId,
  numberOfSeats,
  selectedSeats,
  onSeatSelect,
  onPriceUpdate,
  baseSeatPrice,
  deluxeOffset,
}) => {
  const [seatMap, setSeatMap] = useState<SeatMapType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useCustomToast();

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        setIsLoading(true);
        const data = await getSeatMap(showId);
        setSeatMap(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch seat map:', err);
        setError(err.message || 'Failed to load seat map');
        showToast({
          type: 'error',
          title: 'Error',
          description: err.message || 'Failed to load seat map',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeatMap();
  }, [showId, showToast]);

  useEffect(() => {
    if (seatMap && onPriceUpdate && selectedSeats.length > 0) {
      let deluxeCount = 0;
      for (const seatNumber of selectedSeats) {
        const row = seatNumber.charAt(0);
        if (seatMap[row] && seatMap[row].some(seat =>
          seat.seat_number === seatNumber && seat.type === SEAT_TYPES.DELUXE)) {
          deluxeCount++;
        }
      }
      const basePrice = baseSeatPrice * numberOfSeats;
      const deluxePrice = deluxeCount * deluxeOffset;
      const totalPrice = basePrice + deluxePrice;
      onPriceUpdate(totalPrice, deluxeCount);
    }
  }, [selectedSeats, seatMap, onPriceUpdate, baseSeatPrice, numberOfSeats, deluxeOffset]);

  return (
    <VStack spacing={4} align="stretch" overflow="hidden" w="100%">
      <Text fontSize="lg" fontWeight="bold" color="text.primary">
        Select {numberOfSeats} {numberOfSeats === 1 ? 'Seat' : 'Seats'}
      </Text>
      <Box overflowX="auto" pb={2} w="100%">
        <SeatMap
          numberOfSeats={numberOfSeats}
          selectedSeats={selectedSeats}
          onSeatSelect={onSeatSelect}
          isLoading={isLoading}
          seatMapData={seatMap || undefined}
          showToast={showToast}
        />
      </Box>

      <Box bg="background.secondary" p={3} >
        <Text fontWeight="medium" color="text.secondary">
          Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
        </Text>
      </Box>
    </VStack>
  );
};
