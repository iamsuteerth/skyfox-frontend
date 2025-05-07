'use client';

import { useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Box, 
  Spinner,
  Image,
  Text
} from '@chakra-ui/react';

import { Booking, getQRCode } from '@/services/booking-service';

import type { CustomToastOptions } from '@/app/components/ui/custom-toast';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  showToast?: (args: CustomToastOptions) => void;
}

export default function QRModal({ booking, isOpen, onClose, showToast }: Props) {
  const [base64QR, setBase64QR] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrError, setQRError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && booking) {
      setLoading(true);
      getQRCode(booking.booking_id)
        .then(setBase64QR)
        .catch(err => {
          setQRError(typeof err === 'string' ? err : (err.message || "Failed to load QR code"));
          if(showToast){
            showToast({
              type: 'error',
              title: 'QR Error',
              description: typeof err === 'string' ? err : (err.message || "Failed to load QR code")
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      setBase64QR(null);
      setQRError(null);
    }
  }, [isOpen, booking, showToast]);

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent bg="background.primary" borderRadius="lg" boxShadow="xl">
        <ModalHeader color="text.primary" fontWeight="bold">Booking QR</ModalHeader>
        <ModalCloseButton color="text.primary" />
        <ModalBody marginBottom={4}>
          <Center>
            {loading ? (
             <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="lg" />
            ) : qrError ? (
              <Text color="error" textAlign="center">{qrError}</Text>
            ) : base64QR ? (
              <Box
                p={2}
                borderRadius="lg"
                border="1px solid"
                borderColor="surface.light"
                bg="background.secondary"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={`data:image/png;base64,${base64QR}`}
                  alt="Booking QR"
                  boxSize="180px"
                  objectFit="contain"
                  borderRadius="md"
                  bg="white"
                />
              </Box>
            ) : null}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
