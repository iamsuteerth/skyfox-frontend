'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, Heading, Container, Flex, Button } from '@chakra-ui/react';

import dayjs from 'dayjs';

import { useCustomToast } from '@/app/components/ui/custom-toast';
import { useDialog } from '@/contexts/dialog-context';
import DialogManager from './dialogs/dialog-manager';
import { useShows } from '@/contexts/shows-contex';

import { fetchShows, Show } from '@/services/shows-service';
import { formatDateForAPI } from '@/utils/date-utils';

import ShowsHeader from './shows-header';
import ShowsGrid from './shows-grid';
import NoShows from './no-shows';
import LoadingState from './loading-state';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function Shows() {
  const [isLoading, setIsLoading] = useState(true);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hasError, setHasError] = useState(false);

  const isInitialMount = useRef(true);
  const lastFetchedDate = useRef<string | null>(null);

  const searchParams = useSearchParams();
  const { showToast } = useCustomToast();
  const { openDialog } = useDialog();
  const { lastRefreshTime } = useShows();

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);
      setSelectedDate(normalizedDate);
    } else {
      setSelectedDate(null);
    }
  }, []);

  const handleScheduleShow = () => {
    openDialog('scheduleShow', { date: selectedDate });
  };

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
        setIsLoading(false);
      } else {
        if ('resetToToday' in result && result.resetToToday) {
          const today = new Date();
          today.setHours(12, 0, 0, 0);
          setSelectedDate(today);
        } else {
          setShows([]);
          setHasError(true);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Failed to load shows:', error);
      setShows([]);
      setHasError(true);
    }
  }, [showToast]);

  useEffect(() => {
    if (selectedDate) {
      if (lastRefreshTime) {
        lastFetchedDate.current = null;
      }
      loadShows(selectedDate);
    }
  }, [selectedDate, loadShows, lastRefreshTime]);

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

  const pathname = usePathname();
  useEffect(() => {
    if (!isInitialMount.current && !searchParams.toString()) {
      lastFetchedDate.current = null;
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      setSelectedDate(today);
    }
  }, [pathname, searchParams]);

  return (
    <Container maxW="container.xl" py={6}>
      <Heading as="h1" size="lg" mb={6} color="text.primary">
        Movie Shows
      </Heading>

      <ShowsHeader
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onScheduleShow={handleScheduleShow}
      />

      <Box my={4}>
        {isLoading && <LoadingState />}
        {!isLoading && hasError && <NoShows />}
        {!isLoading && !hasError && shows.length === 0 && <NoShows />}
        {!isLoading && !hasError && shows.length > 0 && <ShowsGrid shows={shows} />}
      </Box>
      <Flex justify="space-between" mt={4} mb={2}>
        <Button
          variant="ghost"
          leftIcon={<ChevronLeftIcon />}
          onClick={() => {
            if (selectedDate) {
              const prevDay = new Date(selectedDate);
              prevDay.setDate(prevDay.getDate() - 1);
              handleDateChange(prevDay);

              const url = new URL(window.location.href);
              url.searchParams.set('date', formatDateForAPI(prevDay));
              window.history.replaceState({}, '', url.toString());
            }
          }}
          isDisabled={isLoading}
        >
          Previous Day
        </Button>
        <Button
          variant="ghost"
          rightIcon={<ChevronRightIcon />}
          onClick={() => {
            if (selectedDate) {
              const nextDay = new Date(selectedDate);
              nextDay.setDate(nextDay.getDate() + 1);
              handleDateChange(nextDay);

              const url = new URL(window.location.href);
              url.searchParams.set('date', formatDateForAPI(nextDay));
              window.history.replaceState({}, '', url.toString());
            }
          }}
          isDisabled={isLoading}
          ml={4}
        >
          Next Day
        </Button>
      </Flex>
      <DialogManager />
    </Container>
  );
}
