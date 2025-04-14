import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Divider,
  useBreakpointValue,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { PriceInput } from './price-input';
import { SummaryBox } from './summary-box';
import { validateForm } from './utils';
import { ScheduleShowFormData, ScheduleShowErrors, Movie, Slot } from './types';

import FormInput from '@/app/components/form-input';
import { formatDateForAPI, safeParseDateString } from '@/utils/date-utils';
import Autocomplete, { Option } from '@/app/components/autocomplete';
import Select from '@/app/components/select';
import { fetchMovies, fetchSlots } from '@/services/shows-service';

const ScheduleShowDialog: React.FC = () => {
  const { dialogData, closeDialog } = useDialog();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'sm',
    md: 'md'
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(dialogData?.date || new Date());
  const [selectedMovie, setSelectedMovie] = useState<string>('');
  const [selectedMovieOption, setSelectedMovieOption] = useState<Option | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [ticketPrice, setTicketPrice] = useState<string>('200');
  const [errors, setErrors] = useState<ScheduleShowErrors>({});

  const [movies, setMovies] = useState<Movie[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const movieOptions = useMemo(() =>
    movies.map(movie => ({ id: movie.movieId, label: movie.name })),
    [movies]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchMoviesData = async () => {
      try {
        const moviesResult = await fetchMovies(showToast);
        if (!isMounted) return;

        if (moviesResult.success && moviesResult.data) {
          const formattedMovies = moviesResult.data.map(movie => ({
            movieId: movie.movieId,
            name: movie.name
          }));
          setMovies(formattedMovies);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching movies:", error);
      }
    };

    fetchMoviesData();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;

    const fetchSlotsData = async () => {
      if (!selectedDate) return;

      setIsLoading(true);
      try {
        const slotsResult = await fetchSlots(selectedDate, showToast);
        if (!isMounted) return;

        if (slotsResult.success) {
          if (slotsResult.data === null) {
            setSlots([]);
          } else {
            const formattedSlots = slotsResult.data!.map(slot => ({
              id: slot.id,
              name: slot.name,
              startTime: slot.startTime,
              endTime: slot.endTime
            }));
            setSlots(formattedSlots);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching slots:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSlotsData();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, showToast]);

  useEffect(() => {
    if (selectedMovie && movies.length > 0) {
      const movie = movies.find(m => m.movieId === selectedMovie);
      setSelectedMovieOption(movie ? { id: movie.movieId, label: movie.name } : null);
    } else {
      setSelectedMovieOption(null);
    }
  }, [selectedMovie, movies]);

  const handleSubmit = async () => {
    setErrors({});

    const price = parseFloat(ticketPrice);
    if (isNaN(price) || price <= 0) {
      setErrors({ price: 'Enter a valid ticket price' });
      return;
    }

    const formData: ScheduleShowFormData = {
      selectedDate,
      selectedMovie,
      selectedSlot,
      ticketPrice: price,
    };

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please fix form errors before submitting.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const truncatedPrice = Math.floor(price * 100) / 100;

      const showData = {
        date: selectedDate?.toISOString().split('T')[0],
        movieId: selectedMovie,
        slotId: selectedSlot,
        price: truncatedPrice,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast({
        type: 'success',
        title: 'Success',
        description: 'Show scheduled successfully'
      });

      closeDialog();
    } catch (error) {
      console.error("Error scheduling show:", error);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to schedule show'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeDialog}
      size={modalSize}
      isCentered
      motionPreset="slideInBottom"
      blockScrollOnMount={false}
      trapFocus
      autoFocus
      returnFocusOnClose
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" style={{ pointerEvents: 'auto' }} />
      <ModalContent
        bg="background.primary"
        borderColor="surface.light"
        borderWidth="1px"
        borderRadius="xl"
        mx={2}
        maxH={{ base: "85vh", md: "auto" }}
        overflow="auto"
        style={{ pointerEvents: 'auto' }}
      >
        <ModalHeader color="text.primary">Schedule a New Show</ModalHeader>
        <ModalCloseButton color="text.tertiary" />
        <Divider borderColor="surface.light" />

        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            <FormControl isRequired isInvalid={!!errors.date}>
              <FormInput
                type="date"
                value={selectedDate ? formatDateForAPI(selectedDate) : ''}
                onChange={(e) => {
                  const date = safeParseDateString(e.target.value);
                  setSelectedDate(date);
                }}
                label='Show Date'
                minDate={formatDateForAPI(new Date())}
              />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>

            <Autocomplete
              options={movieOptions}
              value={selectedMovieOption}
              onChange={(option) => {
                setSelectedMovieOption(option);
                setSelectedMovie(option?.id || '');
              }}
              label="Select Movie"
              placeholder="Search for a movie"
              error={errors.movie}
              isRequired
            />

            <Select
              options={slots.map(slot => ({ value: slot.id, label: slot.name, secondary_label: slot.startTime }))}
              value={selectedSlot}
              onChange={(value) => setSelectedSlot(value as number | null)}
              label="Time Slot"
              placeholder="Select a time slot"
              error={errors.slot}
              isLoading={isLoading}
              name="time-slot"
              currentTimeMs={Date.now()}
              selectedDate={selectedDate?.toISOString().split('T')[0]}
              isTimeDependent
              isRequired
            />

            <PriceInput
              value={ticketPrice}
              onChange={(value) => setTicketPrice(value)}
              error={errors.price}
            />

            <SummaryBox
              selectedMovie={selectedMovie}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              movies={movies}
              slots={slots}
            />
          </VStack>
        </ModalBody>

        <Divider borderColor="surface.light" />
        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={closeDialog}
            isDisabled={isSubmitting}
            borderColor="surface.light"
            color="text.primary"
            _hover={{ bg: 'rgba(224, 75, 0, 0.12)' }}
          >
            Cancel
          </Button>
          <Button
            bg="primary"
            color="white"
            _hover={{ bg: "#CC4300" }}
            _active={{ bg: "#B03B00" }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Scheduling"
          >
            Schedule Show
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleShowDialog;
