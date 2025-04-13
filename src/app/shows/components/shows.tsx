// src/app/shows/components/shows.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Heading, Container } from '@chakra-ui/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchShows, Show } from '@/services/shows-service';
import DateSelector from './date-selector';
import ShowsGrid from './shows-grid';
import NoShows from './no-shows';
import LoadingState from './loading-state';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import dayjs from 'dayjs';
import { formatDateForAPI } from '@/utils/date-utils';

export default function Shows() {
  const [isLoading, setIsLoading] = useState(true);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hasError, setHasError] = useState(false);
  
  const isInitialMount = useRef(true);
  const lastFetchedDate = useRef<string | null>(null);
  
  const searchParams = useSearchParams();
  const { showToast } = useCustomToast();

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);
      setSelectedDate(normalizedDate);
    } else {
      setSelectedDate(null);
    }
  }, []);
  
  const loadShows = useCallback(async (date: Date) => {
    const dateString = dayjs(date).format('YYYY-MM-DD');
    
    if (lastFetchedDate.current === dateString) {
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      lastFetchedDate.current = dateString;
      const result = await fetchShows(date, showToast);
      
      if (result.success && result.data) {
        const sortedShows = [...result.data].sort((a, b) =>
          a.slot.startTime.localeCompare(b.slot.startTime)
        );
        setShows(sortedShows);
      } else {
        setShows([]);
        if (result.error) {
          setHasError(true);
        }
      }
    } catch (error) {
      console.error('Failed to load shows:', error);
      setShows([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);
  
  useEffect(() => {
    if (selectedDate) {
      loadShows(selectedDate);
    }
  }, [selectedDate, loadShows]);
  
  useEffect(() => {
    if (isInitialMount.current) {
      const dateParam = searchParams.get('date');
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      
      if (dateParam) {
        try {
          const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateParam);
          
          if (!isValidDateFormat) {
            throw new Error('Invalid date format');
          }
          
          const [year, month, day] = dateParam.split('-').map(Number);
          
          const parsedDate = new Date(year, month - 1, day, 12, 0, 0, 0);
          
          if (
            parsedDate.getFullYear() !== year ||
            parsedDate.getMonth() !== month - 1 ||
            parsedDate.getDate() !== day
          ) {
            throw new Error('Invalid date');
          }
          
          setSelectedDate(parsedDate);
        } catch (error) {
          console.error('Invalid date parameter:', error);
          setSelectedDate(today);

          const url = new URL(window.location.href);
          url.searchParams.set('date', formatDateForAPI(today));
          window.history.replaceState({}, '', url.toString());
          
          showToast({
            type: 'warning',
            title: 'Invalid Date',
            description: 'The date in the URL was invalid. Showing today\'s shows instead.',
          });
        }
      } else {
        setSelectedDate(today);
      }
      
      isInitialMount.current = false;
    }
  }, [searchParams, showToast]);

  return (
    <Container maxW="container.xl" py={6}>
      <Heading as="h1" size="lg" mb={6} color="text.primary">
        Movie Shows
      </Heading>

      <DateSelector 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange} 
      />
      
      <Box my={4}>
        {isLoading && <LoadingState />}
        {!isLoading && hasError && <NoShows />}
        {!isLoading && !hasError && shows.length === 0 && <NoShows />}
        {!isLoading && !hasError && shows.length > 0 && <ShowsGrid shows={shows} />}
      </Box>
    </Container>
  );
}
