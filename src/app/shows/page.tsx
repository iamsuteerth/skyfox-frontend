// src/app/shows/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  Grid,
  Card,
  CardBody,
  Badge,
  Button,
  Skeleton,
  Select,
  HStack
} from '@chakra-ui/react';
import Header from '@/app/components/header';
import ProtectedRoute from '@/app/components/auth/protected-route';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDateForAPI } from '@/utils/date-utils';

const mockShows = [
  {
    id: 1,
    movie: {
      movieId: "tt1375666",
      name: "Inception",
      duration: "2h 28min",
      plot: "A thief who steals corporate secrets through the use of dream-sharing technology...",
      imdbRating: "8.8",
      moviePoster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      genre: "Action, Adventure, Sci-Fi"
    },
    slot: {
      id: 1,
      name: "Morning",
      startTime: "09:00:00",
      endTime: "12:00:00"
    },
    date: "2025-04-05",
    cost: 250.5,
    availableseats: 100
  },
  {
    id: 2,
    movie: {
      movieId: "tt0468569",
      name: "The Dark Knight",
      duration: "2h 32min",
      plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
      imdbRating: "9.0",
      moviePoster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      genre: "Action, Crime, Drama"
    },
    slot: {
      id: 2,
      name: "Afternoon",
      startTime: "13:00:00",
      endTime: "16:00:00"
    },
    date: "2025-04-05",
    cost: 300,
    availableseats: 50
  }
];



export default function ShowsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [shows, setShows] = useState(mockShows);
  const [selectedDate, setSelectedDate] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get date from URL or use today's date
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const today = formatDateForAPI(new Date());

    if (dateParam) {
      setSelectedDate(dateParam);
    } else {
      setSelectedDate(today);
      router.push(`/shows?date=${today}`);
    }

    // Simulate loading shows
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [searchParams, router]);

  const textColor = 'text.tertiary';
  const bgColor = 'background.primary';
  // Generate date options for the next 7 days
  const dateOptions = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const formattedDate = formatDateForAPI(date);
    const displayDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    dateOptions.push({ value: formattedDate, label: displayDate });
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    router.push(`/shows?date=${newDate}`);
  };

  return (
    <ProtectedRoute>
      <Box minH="100vh" bg="background.primary">
        <Header />
        <Box maxW="1200px" mx="auto" p={4}>
          <Flex justify="space-between" align="center" mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
            <Heading size="lg" color="text.primary">Movie Shows</Heading>
            <HStack spacing={2}>
              <Text color="text.secondary">Date:</Text>
              <Select
                value={selectedDate}
                onChange={handleDateChange}
                maxW="200px"
                bg="background.primary"
                color="text.primary"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </HStack>
          </Flex>

          {isLoading ? (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <Card key={i}>
                  <Skeleton height="300px" />
                  <CardBody>
                    <Skeleton height="20px" mb={2} />
                    <Skeleton height="15px" mb={2} />
                    <Skeleton height="15px" mb={4} />
                    <Skeleton height="40px" />
                  </CardBody>
                </Card>
              ))}
            </Grid>
          ) : shows.length > 0 ? (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
              {shows.map(show => (
                <Card key={show.id} overflow="hidden" boxShadow="md">
                  <Box position="relative" height="300px">
                    <img
                      src={show.movie.moviePoster || '/movie-placeholder.jpg'}
                      alt={show.movie.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      bg="rgba(0,0,0,0.7)"
                      p={2}
                    >
                      <Flex justify="space-between" align="center">
                        <Badge colorScheme="orange">{show.slot.name}</Badge>
                        <Badge colorScheme="green">₹{show.cost}</Badge>
                      </Flex>
                    </Box>
                  </Box>
                  <CardBody>
                    <Stack spacing={2}>
                      <Heading size="md" color="text.primary">{show.movie.name}</Heading>
                      <Text fontSize="sm" color="text.tertiary">
                        {show.movie.duration} • {show.movie.genre}
                      </Text>
                      <Text noOfLines={2} fontSize="sm" color="text.secondary">
                        {show.movie.plot}
                      </Text>
                      <Flex justify="space-between" align="center" mt={2}>
                        <Text fontWeight="bold" color="text.primary">
                          Available: {show.availableseats} seats
                        </Text>
                        <Badge colorScheme="blue">★ {show.movie.imdbRating}</Badge>
                      </Flex>
                      <Button
                        colorScheme="orange"
                        mt={2}
                        variant="solid"
                        isDisabled={show.availableseats === 0}
                      >
                        Book Now
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" p={10}>
              <Heading size="md" mb={4} color="text.primary">No Shows Available</Heading>
              <Text color="text.secondary">There are no shows scheduled for this date.</Text>
              <Text mt={2} color="text.secondary">Please select a different date or check back later.</Text>
            </Box>
          )}
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
