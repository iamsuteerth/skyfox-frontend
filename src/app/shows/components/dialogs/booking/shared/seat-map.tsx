'use client';

import React, { useCallback, memo } from "react";

import {
  Box,
  Text,
  VStack,
  Flex,
  Tooltip,
  useTheme,
  HStack,
  Spinner,
  Center
} from "@chakra-ui/react";

import { RiSofaFill } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";

import { SeatMap as SeatMapType, Seat } from "@/services/booking-service";
import { SEAT_TYPES } from "@/constants";

interface SeatMapProps {
  seatMapData?: SeatMapType;
  numberOfSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  isLoading?: boolean;
  showToast: Function;
}

const SeatButton = memo(
  ({
    seat,
    isSelected,
    onClick,
  }: {
    seat: Seat;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const theme = useTheme();

    const getColor = () => {
      if (seat.occupied) return theme.colors.secondary;
      if (isSelected) return theme.colors["brand"][500];
      return seat.type === SEAT_TYPES.STANDARD
        ? theme.colors["surface"]["light"] || "#e0e0e0"
        : theme.colors["surface"]["dark"] || "#242424";
    };

    const Icon =
      seat.type === SEAT_TYPES.STANDARD ? RiSofaFill : GiSofa;

    return (
      <Box
        as="button"
        onClick={() => !seat.occupied && onClick()}
        disabled={seat.occupied}
        aria-label={seat.seat_number}
        bg="transparent"
        color={getColor()}
        border="none"
        outline="none"
        w="36px"
        h="42px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        mx={0.5}
        my={1}
        _active={{
          outline: "2px solid",
          outlineColor: theme.colors.brand[500],
        }}
        _focus={{
          outline: "2px solid",
          outlineColor: theme.colors.brand[500],
        }}
        cursor={seat.occupied ? "not-allowed" : "pointer"}
        style={{
          transition: "transform 0.1s",
          borderRadius: 8,
        }}
      >
        <Icon size={28} />
      </Box>
    );
  }
);

SeatButton.displayName = "SeatButton";

export const SeatMap: React.FC<SeatMapProps> = memo(
  ({ seatMapData, numberOfSeats, selectedSeats, onSeatSelect, isLoading, showToast }) => {

    const handleSeatClick = useCallback(
      (seat: Seat) => {
        if (seat.occupied) return;
        const seatNumber = seat.seat_number;
        let next = [...selectedSeats];

        if (next.includes(seatNumber)) {
          next = next.filter((s) => s !== seatNumber);
        } else if (next.length < numberOfSeats) {
          next = [...next, seatNumber];
          next.sort((a, b) => {
            const aRow = a.charAt(0);
            const bRow = b.charAt(0);

            if (aRow !== bRow) return aRow.localeCompare(bRow);

            const aCol = parseInt(a.substring(1));
            const bCol = parseInt(b.substring(1));
            return aCol - bCol;
          });
        } else {
          showToast({
            type: 'warning',
            title: 'Maximum seats selected',
            description: `You can only select ${numberOfSeats} seats. Please unselect a seat first.`
          });
          return;
        }
        onSeatSelect(next);
      },
      [selectedSeats, numberOfSeats, onSeatSelect, showToast]
    );

    if (isLoading) {
      return (
        <Center py={6}>
          <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="xl" />
        </Center>
      );
    }

    if (!seatMapData) {
      return (
        <Center py={6}>
          <Text color="text.secondary">No seat data available</Text>
        </Center>
      );
    }

    const rows = Object.keys(seatMapData).sort();
    const columns = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

    const leftCols = columns.slice(0, 5);
    const rightCols = columns.slice(5, 10);

    return (
      <VStack
        spacing={1}
        align="center"
        w="100%"
        bg="background.secondary"
        py={4}
        px={2}
        borderRadius="md"
        minW={{ base: "350px", md: "unset" }}
        maxW="100vw"
        overflowX="auto"
      >
        <Box
          w={{ base: "90%", md: "70%" }}
          h="18px"
          bg="brand.500"
          borderRadius="md"
          mb={2}
          boxShadow="0 2px 14px 0 rgba(0,0,0,0.12)"
        />
        <Text fontSize="sm" color="text.tertiary" mb={2}>
          All eyes this way
        </Text>

        <Box overflowX="auto" w="100%">
          <VStack
            as="section"
            spacing={0.5}
            align="center"
            minW="370px"
            maxW={{ base: "98vw", md: "700px" }}
          >
            <Flex
              w="100%"
              maxW="615px"
              px={1}
              justify="center"
              align="center"
            >
              {[...leftCols, "", ...rightCols].map((col, idx) => (
                <Box
                  key={idx}
                  w="36px"
                  textAlign="center"
                  fontWeight="semibold"
                  color="text.tertiary"
                  fontSize="13px"
                  userSelect="none"
                >
                  {col}
                </Box>
              ))}
            </Flex>
            {rows.map((row) => {
              if (!seatMapData[row] || seatMapData[row].length < 10) {
                return null;
              }

              const leftSeats = seatMapData[row].slice(0, 5);
              const rightSeats = seatMapData[row].slice(5, 10);
              return (
                <Flex
                  key={row}
                  w="100%"
                  maxW="615px"
                  align="center"
                  justify="center"
                  py={0.5}
                  position="relative"
                >
                  <Box
                    w="24px"
                    mr={1}
                    textAlign="right"
                    fontWeight="bold"
                    color="text.tertiary"
                    fontSize="13px"
                    userSelect="none"
                  >
                    {row}
                  </Box>
                  {leftSeats.map((seat) => {
                    const button = (
                      <SeatButton
                        key={seat.seat_number}
                        seat={seat}
                        isSelected={selectedSeats.includes(seat.seat_number)}
                        onClick={() => handleSeatClick(seat)}
                      />
                    );
                    return <Tooltip
                      key={seat.seat_number}
                      label={seat.seat_number}
                      hasArrow
                      placement="top"
                      bg="gray.800"
                      color="white"
                      fontSize="sm"
                      borderRadius="md"
                      px={2}
                      py={1}
                    >
                      {button}
                    </Tooltip>
                  })}
                  <Box w="20px" />
                  {rightSeats.map((seat) => {
                    const button = (
                      <SeatButton
                        key={seat.seat_number}
                        seat={seat}
                        isSelected={selectedSeats.includes(seat.seat_number)}
                        onClick={() => handleSeatClick(seat)}
                      />
                    );
                    return (
                      <Tooltip
                        key={seat.seat_number}
                        label={seat.seat_number}
                        hasArrow
                        placement="top"
                        bg="gray.800"
                        color="white"
                        fontSize="sm"
                        borderRadius="md"
                        px={2}
                        py={1}
                      >
                        {button}
                      </Tooltip>
                    );
                  })}
                  <Box
                    w="24px"
                    ml={1}
                    textAlign="left"
                    fontWeight="bold"
                    color="text.tertiary"
                    fontSize="13px"
                    userSelect="none"
                  >
                    {row}
                  </Box>
                </Flex>
              );
            })}
          </VStack>
        </Box>

        <Flex
          mt={4}
          gap={6}
          fontSize="sm"
          color="text.tertiary"
          align="center"
          wrap="wrap"
          justify="center"
        >
          <HStack>
            <Box as={RiSofaFill} size="20px" color="surface.light" />
            <Text>Standard</Text>
          </HStack>
          <HStack>
            <Box as={GiSofa} size="20px" color="surface.dark" />
            <Text>Deluxe</Text>
          </HStack>
          <HStack>
            <Box as={RiSofaFill} size="20px" color="brand.500" />
            <Text>Selected</Text>
          </HStack>
          <HStack>
            <Box as={RiSofaFill} size="20px" color="secondary" />
            <Text>Occupied</Text>
          </HStack>
        </Flex>
      </VStack>
    );
  }
);

SeatMap.displayName = "SeatMap";

export default SeatMap;
