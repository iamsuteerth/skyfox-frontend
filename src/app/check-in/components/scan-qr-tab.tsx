'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Box,
  Text,
  Button,
  Center,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { singleCheckIn } from "@/services/check-in-service";

type ScanQRTabProps = {
  isActive: boolean;
};

function extractBookingIdFromQr(text: string): string | null {
  const match = text.match(/SKYFOX BOOKING #(\d+)/i);
  return match ? match[1] : null;
}

export default function ScanQRTab({ isActive }: ScanQRTabProps) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [fullQr, setFullQr] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);


  const { showToast } = useCustomToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const modal = useDisclosure();

  useEffect(() => {
    let ignore = false;
    async function checkDevices() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setHasCamera(false);
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(d => d.kind === 'videoinput');
        if (!ignore) setHasCamera(hasVideo);
      } catch {
        if (!ignore) setHasCamera(false);
      }
    }
    checkDevices();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    function stopScanner() {
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
      setScanning(false);
    }

    if (isActive && hasCamera && videoRef.current && !scannedId) {
      setError(null);
      setScanning(true);
      const qrReader = new BrowserQRCodeReader();

      qrReader
        .decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, err, controls) => {
            // Save controls for cleanup
            if (controls && !scannerControlsRef.current) {
              scannerControlsRef.current = controls;
            }
            if (!result) {
              if (
                err &&
                err.name !== 'NotFoundException' &&
                err.name !== 'ChecksumException' &&
                err.name !== 'FormatException'
              ) {
                setError('Failed to scan QR.');
              }
              return;
            }

            const rawText = result.getText();
            const bookingId = extractBookingIdFromQr(rawText);

            if (!isCancelled) {
              stopScanner();
              if (!bookingId) {
                setError('Invalid QR Code! Please scan a valid ticket.');
                setTimeout(() => {
                  setError(null);
                  setScanning(false);
                }, 2000);
                return;
              }
              setScannedId(bookingId);
              setFullQr(rawText);
              modal.onOpen();
            }
          }
        )
        .catch(() => {
          if (!isCancelled) {
            setScanning(false);
            setError('Camera initialization failed.');
          }
        });

      return () => {
        isCancelled = true;
        stopScanner();
      };
    } else {
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
      setScanning(false);
    }
  }, [isActive, hasCamera, scannedId, modal]);

  function handleModalClose() {
    setScannedId(null);
    setFullQr(null);
    setError(null);
    setScanning(false);
    modal.onClose();
  }

  async function handleModalConfirm() {
    if (!scannedId) return;
    setCheckingIn(true);
    const bookingId = Number(scannedId);

    const res = await singleCheckIn(bookingId, showToast);

    setCheckingIn(false);

    if (res.success) {
      showToast({
        type: "success",
        title: "Checked In",
        description: `Booking ID ${scannedId} checked in successfully.`
      });
    } else {
      showToast({
        type: "error",
        title: "Check-in Failed",
        description: res.error || "Unknown error occurred."
      });
    }

    setScannedId(null);
    setFullQr(null);
    setError(null);
    setScanning(false);
    modal.onClose();
    setTimeout(() => setScanning(false), 100);
  }

  const qrBoxSize = useBreakpointValue({ base: '90vw', md: '360px' });

  return (
    <Center w="full" py={{ base: 4, md: 8 }} minH="480px">
      <VStack spacing={6} maxW="sm" w="100%">
        <Text fontSize="lg" fontWeight="semibold" color="text.primary">
          Scan Booking QR Code
        </Text>
        {hasCamera === null && (
          <Center py={6} w="full">
            <Spinner size="lg" color="primary.500" />
            <Text ml={3} color="text.tertiary">
              Checking for camera...
            </Text>
          </Center>
        )}
        {hasCamera === false && (
          <Alert status="error" borderRadius="md" bg="red.50">
            <AlertIcon />
            No camera found. Please connect a camera and refresh.
          </Alert>
        )}
        {hasCamera && (
          <Box
            border="1px solid"
            borderColor="surface.light"
            borderRadius="lg"
            w="100%"
            maxW={qrBoxSize}
            aspectRatio={1}
            overflow="hidden"
            position="relative"
            bg="surface.light"
          >
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'inherit',
                background: 'black',
              }}
              autoPlay
              muted
            />
            <Box
              pointerEvents="none"
              position="absolute"
              inset={0}
              border="2px dashed"
              borderColor="primary"
              borderRadius="lg"
            />
          </Box>
        )}
        {error && (
          <Alert status="error" borderRadius="md" bg="red.50" w="full">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Button
          onClick={() => window.location.reload()}
          colorScheme="primary"
          variant="outline"
          size="md"
          display={hasCamera === false ? 'block' : 'none'}
        >
          Retry
        </Button>
        <Modal isOpen={modal.isOpen} onClose={handleModalClose} isCentered>
          <ModalOverlay />
          <ModalContent
            bg="background.primary"
            borderRadius="xl"
            boxShadow="xl"
            mx={2}
            minW={{ base: "90vw", md: "420px" }}
            p={0}
          >
            <ModalHeader
              bg="background.primary"
              borderTopRadius="xl"
              borderBottomWidth="1px"
              borderColor="surface.light"
              py={3}
              px={5}
              fontWeight={700}
              fontSize="lg"
              color="text.primary"
            >Booking QR Scanned
            </ModalHeader>
            <ModalBody bg="background.primary" py={4}>
              <Text mb={1}>
                <b>Booking ID:</b> {scannedId}
              </Text>
              <Box
                fontSize="sm"
                color="text.secondary"
                whiteSpace="pre-wrap"
                border="1px solid"
                borderColor="surface.light"
                borderRadius="md"
                p={3}
                my={3}
                bg="background.secondary"
                maxH="240px"
                overflowY="auto"
              >
                {fullQr}
              </Box>
            </ModalBody>
            <ModalFooter
              bg="background.primary"
              borderBottomRadius="xl"
              borderTopWidth="1px"
              borderColor="surface.light"
              py={3}
              px={5}
              display="flex"
              gap={3}
            >
              <Button
                variant="outline"
                mr={2}
                onClick={handleModalClose}
                colorScheme="gray"
                isDisabled={checkingIn}
              >
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                onClick={handleModalConfirm}
                isLoading={checkingIn}
              >
                Confirm &amp; Scan Next
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Center>
  );
}
