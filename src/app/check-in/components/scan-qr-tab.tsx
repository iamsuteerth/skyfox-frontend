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
  const [permissionState, setPermissionState] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [fullQr, setFullQr] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const { showToast } = useCustomToast();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const modal = useDisclosure();
  const attemptedInitRef = useRef(false);
  const isMountedRef = useRef(true);

  function stopScanner() {
    try {
      if (scannerControlsRef.current) {
        scannerControlsRef.current.stop();
        scannerControlsRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.error("Error stopping scanner:", e);
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    isMountedRef.current = true;

    async function checkDevices() {
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current && hasCamera === null) {
          console.log("Camera detection timed out, assuming no camera");
          setHasCamera(false);
        }
      }, 5000);

      if (!navigator.mediaDevices?.getUserMedia) {
        clearTimeout(timeoutId);
        setHasCamera(false);
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(d => d.kind === 'videoinput');

        if (!isMountedRef.current) return;

        clearTimeout(timeoutId);
        setHasCamera(hasVideo);

        if (hasVideo && navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
            if (isMountedRef.current) setPermissionState(permissionStatus.state);

            permissionStatus.onchange = () => {
              if (isMountedRef.current) {
                setPermissionState(permissionStatus.state);
                attemptedInitRef.current = false;
              }
            };
          } catch (err) {
            console.error("Permission query error:", err);
          }
        }
      } catch (err) {
        console.error("Error checking devices:", err);
        if (isMountedRef.current) setHasCamera(false);
      }
    }

    checkDevices();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      stopScanner();
      attemptedInitRef.current = false;
      return;
    }

    if (isActive && hasCamera === true && videoRef.current && !scannedId && !attemptedInitRef.current) {
      attemptedInitRef.current = true;
      setError(null);
      setScanning(true);

      const qrReader = new BrowserQRCodeReader();

      qrReader
        .decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, err, controls) => {
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

            if (!isMountedRef.current) return;

            stopScanner();
            if (!bookingId) {
              setError('Invalid QR Code! Please scan a valid ticket.');
              setTimeout(() => {
                if (isMountedRef.current) {
                  setError(null);
                  setScanning(false);
                  attemptedInitRef.current = false;
                }
              }, 2000);
              return;
            }

            setScannedId(bookingId);
            setFullQr(rawText);
            modal.onOpen();
          }
        )
        .then(() => {
          if (!isMountedRef.current) return;

          if (videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((e) => {
                console.error("Play promise error (handled):", e);
              });
            }
          }
        })
        .catch((err) => {
          console.error("Camera initialization error:", err);
          if (!isMountedRef.current) return;

          stopScanner();
          setScanning(false);
          attemptedInitRef.current = false;

          if (err.name === 'NotAllowedError') {
            setPermissionState('denied');
            setError('Camera permission denied. Please allow camera access and try again.');
          } else {
            setError('Camera initialization failed: ' + (err.message || 'Unknown error'));
          }
        });
    }

    return () => {
      stopScanner();
    };
  }, [isActive, hasCamera, scannedId, modal, permissionState]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        stopScanner();
        attemptedInitRef.current = false;
      } else if (document.visibilityState === 'visible' && isActive && !scannedId) {
        attemptedInitRef.current = false;
      }
    }

    function handleBeforeUnload() {
      stopScanner();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopScanner();
    };
  }, [isActive, scannedId]);

  function handleModalClose() {
    setScannedId(null);
    setFullQr(null);
    setError(null);
    setScanning(false);
    attemptedInitRef.current = false;
    modal.onClose();
  }

  async function handleModalConfirm() {
    if (!scannedId) return;
    setCheckingIn(true);
    const bookingId = Number(scannedId);
    const res = await singleCheckIn(bookingId, showToast);
    setCheckingIn(false);

    if (res.success) {
      const description = (res.data?.checked_in.length || 0) > 0
        ? `Checked in booking ${res.data?.checked_in[0]}`
        : (res.data?.already_done.length || 0) > 0
          ? `Booking ${res.data?.already_done[0]} already checked in`
          : `Invalid Booking: ${res.data?.invalid[0]}`;

      showToast({
        type: 'success',
        title: 'Check-in Complete',
        description
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
    modal.onClose();

    stopScanner();
    attemptedInitRef.current = false;
  }

  const qrBoxSize = useBreakpointValue({ base: '90vw', md: '360px' });

  return (
    <VStack spacing={6} w="100%">
      <Box textAlign="center">
        <Text color="text.primary" fontSize="xl" fontWeight="medium">Scan Booking QR Code</Text>
      </Box>

      {hasCamera === null && (
        <Center py={10}>
          <Spinner color="primary" size="lg" thickness="4px" speed="0.65s" emptyColor="surface.light" />
          <Text ml={3} color="text.secondary">Checking for camera...</Text>
        </Center>
      )}

      {hasCamera === false &&
        (<>
          <Alert status="error" variant="solid" borderRadius="lg" bg="error" width="-moz-fit-content">
            <AlertIcon color="background.primary" />
            <Text color="white">No camera found. Please connect a camera and refresh.</Text>
          </Alert>
          <Button
            onClick={() => window.location.reload()}
            colorScheme="primary"
            variant="outline"
            size="md"
          >
            Refresh
          </Button>
        </>
        )}

      {hasCamera === true && (
        <Box
          width={qrBoxSize}
          height={qrBoxSize}
          maxW="90vw"
          maxH="90vw"
          borderWidth="1px"
          borderColor={error ? "error" : "surface.light"}
          borderStyle={scanning ? "solid" : "dashed"}
          borderRadius="xl"
          bg="background.secondary"
          overflow="hidden"
          position="relative"
        >
          {scanning && (
            <Box as="video" ref={videoRef} width="100%" height="100%" objectFit="cover" />
          )}

          {!scanning && !error && hasCamera && !checkingIn && (
            <Center height="100%">
              <VStack spacing={4}>
                <Text color="text.tertiary">Camera is off</Text>
                <Button
                  onClick={() => {
                    attemptedInitRef.current = false;
                    setScanning(true);
                  }}
                  colorScheme="primary"
                >
                  Start Scanning
                </Button>
              </VStack>
            </Center>
          )}

          {error && (
            <Center height="100%" p={4}>
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Text color="text.primary">{error}</Text>
              </Alert>
            </Center>
          )}

          {permissionState === 'denied' && (
            <Center height="100%" p={4}>
              <VStack spacing={4}>
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text color="text.primary">Camera permission denied</Text>
                </Alert>
                <Button
                  onClick={() => window.location.reload()}
                  colorScheme="primary"
                  variant="outline"
                  size="md"
                >
                  Retry
                </Button>
              </VStack>
            </Center>
          )}
        </Box>
      )}

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
  );
}