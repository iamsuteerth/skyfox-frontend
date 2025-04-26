import React from 'react';
import Image from 'next/image';
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  Tooltip,
  HStack,
  VStack,
  Icon
} from '@chakra-ui/react';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
import { Show } from '@/services/shows-service';
import { formatDuration } from '@/utils/date-utils';
import { ROLES } from '@/constants';
import { RoleBasedElement } from '@/app/components/auth/role-based-element';
import { useDialog } from '@/contexts/dialog-context';
import useRoleBasedFunction from '@/app/components/auth/role-based-function';
import { useCustomToast } from '@/app/components/ui/custom-toast';

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const { openDialog } = useDialog();
  const { executeByRole } = useRoleBasedFunction();
  const { showToast } = useCustomToast();

  const formattedCost = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(show.cost);

  const startTime = show.slot.startTime.substring(0, 5);
  const formattedDuration = formatDuration(show.movie.duration);
  const shortGenre = show.movie.genre.split(', ').slice(0, 2).join(', ');
  const hasMoreGenres = show.movie.genre.split(', ').length > 2;

  const hasStarted = () => {
    const now = new Date();
    const [hours, minutes] = show.slot.startTime.split(':').map(Number);
    const showDate = new Date(show.date);
    showDate.setHours(hours, minutes);
    return now > showDate;
  };

  const isShowStarted = hasStarted();
  const isAvailable = !isShowStarted && show.availableseats > 0;

  const handleBooking = () => {
    executeByRole({
      adminExecute: () => openDialog('adminBooking', { show }),
      customerExecute: () => openDialog('customerBooking', { show }),
      staffExecute: () => showToast({
        type: 'warning',
        title: 'User role not permitted!'
      }),
      execute: () => showToast({
        type: 'warning',
        title: 'User role not permitted!'
      })
    });
  };
  
  return (
    <Box
      w="300px"
      minW="300px"
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg={isShowStarted ? "gray.200" : "background.primary"}
      borderColor={isShowStarted ? "gray.400" : "surface.light"}
      shadow="sm"
      transition="all 0.3s"
      _hover={{
        shadow: isAvailable ? "md" : "sm",
        transform: isAvailable ? 'translateY(-3px)' : 'none',
        borderColor: isAvailable ? 'brand.300' : isShowStarted ? "gray.400" : "surface.light"
      }}
      mr={6}
      pb={1}
      opacity={isShowStarted ? 0.5 : 1}
      position="relative"
    >
      {!isAvailable && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1}
          bg="transparent"
          pointerEvents="none"
        />
      )}
      {isShowStarted && (
        <Badge
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%) rotate(-30deg)"
          zIndex={2}
          colorScheme="prun art"
          fontSize="lg"
          py={2}
          px={4}
          borderRadius="md"
          boxShadow="md"
        >
          Show Started
        </Badge>
      )}

      {!isShowStarted && show.availableseats === 0 && (
        <Badge
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%) rotate(-30deg)"
          zIndex={2}
          colorScheme="red"
          fontSize="lg"
          py={2}
          px={4}
          borderRadius="md"
          boxShadow="md"
        >
          Sold Out
        </Badge>
      )}
      <Box position="relative" h="200px" w="full" opacity={isShowStarted ? 0.7 : 1}>
        <Image
          src={show.movie.moviePoster}
          alt={show.movie.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="300px"
          priority
        />

        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="70px"
          bgGradient="linear(to-b, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)"
        />

        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="100px"
          bgGradient="linear(to-t, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)"
        />

        <Flex
          position="absolute"
          top={3}
          right={3}
          align="center"
          bg="rgba(0,0,0,0.7)"
          color="white"
          borderRadius="md"
          px={2}
          py={1}
          fontSize="sm"
        >
          <Icon as={StarIcon} color="gold" mr={1} boxSize={3} />
          <Text fontWeight="bold" color="background.primary">{show.movie.imdbRating}</Text>
        </Flex>

        <Flex
          position="absolute"
          bottom={3}
          left={3}
          right={3}
          justify="space-between"
          align="center"
        >
          <Badge colorScheme={isShowStarted ? 'gray' : 'brand'} variant="subtle" px={2} py={1}>
            {show.slot.name}
          </Badge>

          <HStack
            spacing={1}
            bg="rgba(0,0,0,0.7)"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
          >
            <Icon as={TimeIcon} boxSize={3} color="background.primary" />
            <Text fontSize="sm" fontWeight="medium" color="background.primary">
              {startTime}
            </Text>
          </HStack>
        </Flex>
      </Box>

      <VStack align="stretch" spacing={3} p={4} pt={3}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={isShowStarted ? "text.tertiary" : "text.primary"}
          noOfLines={1}
          lineHeight="tight"
        >
          {show.movie.name}
        </Text>

        <HStack spacing={1}>
          <Text fontSize="sm" color="text.tertiary" noOfLines={1}>
            {formattedDuration} • {shortGenre}
            {hasMoreGenres && (
              <Tooltip
                label={show.movie.genre}
                placement="top"
                hasArrow
                bg="background.secondary"
                color="text.primary"
              >
                <Text as="span" cursor="pointer" color={isShowStarted ? "text.tertiary" : "brand.400"}> +more</Text>
              </Tooltip>
            )}
          </Text>
        </HStack>

        <Tooltip
          label={show.movie.plot}
          placement="bottom"
          hasArrow
          bg="background.secondary"
          color="text.primary"
          openDelay={300}
        >
          <Text
            noOfLines={2}
            fontSize="sm"
            color={isShowStarted ? "text.tertiary" : "text.secondary"}
            minH="40px"
            cursor="pointer"
          >
            {show.movie.plot}
          </Text>
        </Tooltip>

        <Flex justify="space-between" align="center" mt={1}>
          <RoleBasedElement allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
            <Text fontSize="sm" color="text.tertiary">
              <Text 
                as="span" 
                fontWeight="semibold" 
                color={isShowStarted 
                  ? "gray.500" 
                  : show.availableseats > 15 
                    ? "green.500" 
                    : show.availableseats === 0 
                      ? "red.600" 
                      : "red.500"}
              >
                {show.availableseats}
              </Text> seats left
            </Text>
          </RoleBasedElement>
          <Text 
            fontSize="lg" 
            fontWeight="bold" 
            color={isShowStarted ? "gray.500" : "brand.500"}
          >
            {formattedCost}
          </Text>
        </Flex>

        <RoleBasedElement allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
          <Button
            bg={isAvailable ? "brand.500" : "gray.400"}
            color="white"
            size="md"
            borderRadius="md"
            width="100%"
            mt={1}
            fontWeight="medium"
            onClick={handleBooking}
            cursor={isAvailable ? "pointer" : "not-allowed"}
            disabled={!isAvailable || isShowStarted}
            _hover={{
              bg: isAvailable ? "brand.600" : "gray.400",
            }}
            _active={{
              bg: isAvailable ? "brand.700" : "gray.400",
              transform: isAvailable ? 'scale(0.98)' : 'none'
            }}
          >
            {isShowStarted ? "Show Started" : show.availableseats === 0 ? "Sold Out" : "Book Now"}
          </Button>
        </RoleBasedElement>
      </VStack>
    </Box>
  );
};

export default ShowCard;
