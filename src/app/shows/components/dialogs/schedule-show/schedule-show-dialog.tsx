import React, { useState, useEffect } from 'react';
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
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { MovieSelector } from './movie-selector';
import { SlotSelector } from './slot-selector';
import { PriceInput } from './price-input';
import { SummaryBox } from './summary-box';
import { validateForm } from './utils';
import { ScheduleShowFormData, ScheduleShowErrors, Movie, Slot } from './types';

import FormInput from '@/app/components/form-input';
import { formatDateForAPI, safeParseDateString } from '@/utils/date-utils';

const ScheduleShowDialog: React.FC = () => {
  const { dialogData, closeDialog } = useDialog();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalSize = useBreakpointValue({ 
    base: 'xs', 
    sm: 'sm',
    md: 'md' 
  });

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(dialogData?.date || new Date());
  const [selectedMovie, setSelectedMovie] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [ticketPrice, setTicketPrice] = useState<string>('200');
  const [errors, setErrors] = useState<ScheduleShowErrors>({});

  // Data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch movies and slots
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        setMovies([
          { movieId: 'tt4178092', name: 'The Gift' },
          { movieId: 'tt5968394', name: 'Captive State' },
          { movieId: 'tt5052448', name: 'Get Out' },
        ]);

        setSlots([
          { id: 1, name: 'Morning', startTime: '09:00:00', endTime: '12:00:00' },
          { id: 2, name: 'Afternoon', startTime: '13:00:00', endTime: '16:00:00' },
          { id: 3, name: 'Evening', startTime: '17:00:00', endTime: '20:00:00' },
          { id: 4, name: 'Night', startTime: '21:00:00', endTime: '00:00:00' },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to load required data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showToast]);


  const handleSubmit = async () => {
    const price = parseFloat(ticketPrice);
    if (isNaN(price) || price <= 0) {
      setErrors((prev) => ({ ...prev, price: 'Enter a valid ticket price' }));
      return;
    }
    const formData: ScheduleShowFormData = {
      selectedDate,
      selectedMovie,
      selectedSlot,
      ticketPrice:price,
    };

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
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

      // Replace with actual API call
      console.log('Scheduling show:', showData);
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
      trapFocus={false}
      returnFocusOnClose={true}
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

            <MovieSelector
              movies={movies}
              selectedMovie={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              error={errors.movie}
              isLoading={isLoading}
            />

            <SlotSelector
              slots={slots}
              selectedSlot={selectedSlot}
              onChange={(e) => setSelectedSlot(parseInt(e.target.value))}
              error={errors.slot}
              isLoading={isLoading}
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
