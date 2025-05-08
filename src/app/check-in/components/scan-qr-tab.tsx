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
import { Html5Qrcode } from 'html5-qrcode';

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
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const modal = useDisclosure();
  const attemptedInitRef = useRef(false);
  const isMountedRef = useRef(true);

  function stopScanner() {
    try {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current = null;
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
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (!isActive || !scanning) {
      stopScanner();
      return;
    }

    if (!hasCamera || scannedId || !scannerContainerRef.current) {
      return;
    }

    const containerId = `qr-scanner-${Date.now()}`;
    const tempDiv = document.createElement('div');
    tempDiv.id = containerId;
    tempDiv.style.width = '100%';
    tempDiv.style.height = '100%';
    
    if (scannerContainerRef.current) {
      scannerContainerRef.current.innerHTML = '';
      scannerContainerRef.current.appendChild(tempDiv);
    
      try {
        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;
        
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 24,
            aspectRatio: 1
          },
          (decodedText) => {
            const bookingId = extractBookingIdFromQr(decodedText);
            
            if (!isMountedRef.current) return;
            
            stopScanner();
            
            if (!bookingId) {
              setError('Invalid QR Code! Please scan a valid ticket.');
              setTimeout(() => {
                if (isMountedRef.current) {
                  setError(null);
                  setScanning(false);
                }
              }, 2000);
              return;
            }
            
            setScannedId(bookingId);
            setFullQr(decodedText);
            modal.onOpen();
          },
          (errorMessage) => {
            if (errorMessage.includes("No QR code found")) {
              return;
            }
          }
        ).catch(error => {
          console.error("QR Scanner initialization error:", error);
          setError("Failed to start camera: " + (error.message || "Unknown error"));
          setScanning(false);
          
          if (error.name === 'NotAllowedError') {
            setPermissionState('denied');
          }
        });
      } catch (error) {
        console.error("QR Scanner error:", error);
        setError("Failed to initialize scanner");
        setScanning(false);
      }
    }

    return () => {
      stopScanner();
    };
  }, [isActive, scanning, hasCamera, scannedId]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        stopScanner();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  function handleStartScanning() {
    setError(null);
    setScanning(true);
  }

  function handleModalClose() {
    setScannedId(null);
    setFullQr(null);
    setError(null);
    modal.onClose();
  }

  async function handleModalConfirm() {
    if (!scannedId) return;
    setCheckingIn(true);
    try {
      const bookingId = Number(scannedId);
      const res = await singleCheckIn(bookingId, showToast);

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
    } catch (error) {
      console.error("Check-in error:", error);
      showToast({
        type: "error",
        title: "Check-in Failed",
        description: "An unexpected error occurred"
      });
    } finally {
      setCheckingIn(false);
      setScannedId(null);
      setFullQr(null);
      modal.onClose();
    }
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
          <Box 
            ref={scannerContainerRef} 
            width="100%" 
            height="100%" 
            display={scanning ? "block" : "none"}
          />

          {!scanning && !error && !checkingIn && (
            <Center height="100%">
              <VStack spacing={4}>
                <Text color="text.tertiary">Camera is off</Text>
                <Button
                  onClick={handleStartScanning}
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
