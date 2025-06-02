import React, { useState, useEffect, useMemo } from 'react';

import {
  Box,
  VStack,
  HStack,
  RadioGroup,
  Radio,
  Tabs,
  TabList,
  Tab,
  FormControl,
  FormLabel,
  Text,
  Heading,
  Button,
  Icon,
  Divider,
  useBreakpointValue,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { FiBarChart2, FiFilter } from 'react-icons/fi';

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { fetchRevenue, RevenueParams, RevenueData } from '@/services/revenue-service';
import { fetchMovies, fetchAllSlots, Movie, Slot } from '@/services/shows-service';

import Select from '@/app/components/select';
import Autocomplete from '@/app/components/autocomplete';
import { RevenueInputForm } from './revenue-input';
import { RevenueCharts } from './revenue-charts';

const StatsVisualization: React.FC = () => {
  const { showToast } = useCustomToast();
  const [viewType, setViewType] = useState<'timeframe' | 'specific'>('timeframe');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [timeframeIndex, setTimeframeIndex] = useState(0);

  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [movieId, setMovieId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<RevenueData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isMoviesLoading, setIsMoviesLoading] = useState(false);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [selectedMovieOption, setSelectedMovieOption] = useState<{ id: string, label: string } | null>(null);

  const cardBg = 'background.primary';
  const cardBorder = 'gray.200';
  const textColor = 'text.primary';
  const subtextColor = 'text.secondary';
  const accentColor = "#E04B00";
  const summaryBg = 'gray.50';

  const columns = useBreakpointValue({
    base: 1,
    sm: 1,
    md: 2,
    lg: 3
  }) || 1;

  useEffect(() => {
    const timeframes = ['daily', 'weekly', 'monthly', 'yearly'] as const;
    const index = timeframes.indexOf(timeframe);
    setTimeframeIndex(index);
  }, [timeframe]);

  useEffect(() => {
    const loadMoviesAndSlots = async () => {
      setIsMoviesLoading(true);
      try {
        const result = await fetchMovies(showToast);
        if (result.success && result.data) {
          setMovies(result.data);
        }
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setIsMoviesLoading(false);
      }

      setIsSlotsLoading(true);
      try {
        const result = await fetchAllSlots(showToast);
        if (result.success && result.data) {
          setSlots(result.data);
        }
      } catch (error) {
        console.error('Failed to load slots:', error);
      } finally {
        setIsSlotsLoading(false);
      }
    };

    loadMoviesAndSlots();
  }, [showToast]);

  useEffect(() => {
    if (movieId && movies.length > 0) {
      const movie = movies.find(m => m.movieId === movieId);
      setSelectedMovieOption(movie ? { id: movie.movieId, label: movie.name } : null);
    } else {
      setSelectedMovieOption(null);
    }
  }, [movieId, movies]);

  useEffect(() => {
    if (viewType === 'timeframe') {
      setMonth(null);
    } else {
    }
  }, [viewType]);

  const movieOptions = useMemo(() => 
    movies.map(movie => ({
      id: movie.movieId,
      label: movie.name
    })),
    [movies]
  );
  
  const slotOptions = useMemo(() => 
    slots.map(slot => ({
      value: slot.id.toString(),
      label: slot.name,
      secondary_label: slot.startTime
    })),
    [slots]
  );

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: RevenueParams = {};

      if (viewType === 'timeframe') {
        params.timeframe = timeframe;
      } else {
        if (month !== null) params.month = month;
        if (year !== null) params.year = year;
      }

      if (movieId) params.movie_id = movieId;
      if (slotId) params.slot_id = slotId;
      if (genre) params.genre = genre;

      const data = await fetchRevenue(params, showToast);
      setChartData(data);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError(error.message || 'Failed to fetch data');
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewType, timeframe]);

  const handleMonthChange = (selected: string | number | null) => {
    const monthValue = typeof selected === 'string' ? parseInt(selected, 10) : selected;
    setMonth(monthValue);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setDefaultDate();
    } else {
      setYear(parseInt(e.target.value, 10));
    }
  };

  const setDefaultDate = () => {
    const now = new Date().getFullYear();
    setYear(now);
  };
  
  const handleTimeframeChange = (index: number) => {
    const timeframes = ['daily', 'weekly', 'monthly', 'yearly'] as const;
    setTimeframeIndex(index);
    setTimeframe(timeframes[index]);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenre(e.target.value);
  };

  const handleSlotChange = (selected: string | number | null) => {
    setSlotId(selected as string);
  };

  const handleMovieChange = (option: { id: string; label: string } | null) => {
    setSelectedMovieOption(option);
    setMovieId(option?.id || null);
  };

  return (
    <Box
      p={5}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={cardBorder}
      bg={cardBg}
      boxShadow="sm"
    >
      <VStack spacing={5} align="flex-start" w="full">
        <Box>
          <Heading size="md" color={textColor} mb={1} display="flex" alignItems="center">
            <Icon as={FiBarChart2} mr={2} />
            Revenue Statistics
          </Heading>
          <Text fontSize="sm" color={subtextColor}>
            Analyze revenue data with flexible time and filter options
          </Text>
        </Box>

        <Box
          p={3}
          bg={summaryBg}
          borderRadius="md"
          w="full"
          borderLeft="4px solid"
          borderColor={accentColor}
        >
          <Text fontWeight="medium" color={textColor}>
            {viewType === 'timeframe'
              ? `Viewing revenue data by ${timeframe} timeframe`
              : 'Viewing specific time period revenue data'}
            {month && ` in ${monthOptions.find(m => m.value === month)?.label}, ${year}`}
            {movieId && ` for "${selectedMovieOption?.label || 'selected movie'}"`}
            {slotId && ` in "${slots.find(slot => slot.id.toString() === slotId)?.name}" slot`}
            {genre && ` with genre: ${genre}`}
          </Text>
        </Box>

        <RadioGroup onChange={(val: 'timeframe' | 'specific') => setViewType(val)} value={viewType}>
          <HStack spacing={6}>
            <Radio
              value="timeframe"
              colorScheme="brand"
              borderColor="primary"
              background="background.primary"
            >
              <Text fontWeight="medium" color="text.primary">Timeframe</Text>
            </Radio>
            <Radio
              value="specific"
              colorScheme="brand"
              borderColor="primary"
              background="background.primary"
            >
              <Text fontWeight="medium" color="text.primary">Specific Time</Text>
            </Radio>
          </HStack>
        </RadioGroup>

        {viewType === 'timeframe' && (
          <Tabs
            index={timeframeIndex}
            onChange={handleTimeframeChange}
            variant="soft-rounded"
            colorScheme="orange"
            w="full"
          >
            <TabList>
              <Tab>Daily</Tab>
              <Tab>Weekly</Tab>
              <Tab>Monthly</Tab>
              <Tab>Yearly</Tab>
            </TabList>
          </Tabs>
        )}

        <Divider />

        <Box width="100%">
          {viewType === 'specific' && (
            <SimpleGrid columns={columns} spacing={4} mb={4} width="100%">
              <FormControl>
                <FormLabel color={textColor}>Month</FormLabel>
                <Select
                  placeholder="Select Month"
                  options={monthOptions}
                  onChange={handleMonthChange}
                  value={month}
                  label=""
                />
              </FormControl>

              <RevenueInputForm
                type="number"
                label="Year"
                value={year!}
                onChange={handleYearChange}
              />
            </SimpleGrid>
          )}

          <SimpleGrid columns={columns} spacing={4} mb={4} width="100%">
            <FormControl>
              <FormLabel color={textColor}>Movie</FormLabel>
              <Autocomplete
                options={movieOptions}
                value={selectedMovieOption}
                onChange={handleMovieChange}
                label=""
                placeholder={isMoviesLoading ? "Loading movies..." : "Select Movie"}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Slot</FormLabel>
              <Select
                placeholder={isSlotsLoading ? "Loading slots..." : "Select Slot"}
                options={slotOptions}
                onChange={handleSlotChange}
                value={slotId}
                label=""
                isLoading={isSlotsLoading}
              />
            </FormControl>

            <RevenueInputForm
              type="text"
              label="Genre"
              value={genre}
              onChange={handleGenreChange}
            />
          </SimpleGrid>

          <Flex justifyContent="flex-start" mb={4}>
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Loading..."
              onClick={fetchData}
              leftIcon={<Icon as={FiFilter} />}
              bgColor={accentColor}
              _hover={{ bgColor: "#c04200" }}
            >
              Apply Filters
            </Button>
          </Flex>
        </Box>

        <Box w="full" mt={4}>
          <RevenueCharts
            data={chartData}
            isLoading={isLoading}
            viewType={viewType}
            timeframe={viewType === 'timeframe' ? timeframe : undefined}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default StatsVisualization;
