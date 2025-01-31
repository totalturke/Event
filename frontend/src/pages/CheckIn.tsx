import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Heading,
  VStack,
  Button,
  Text,
  useToast,
  Box,
} from '@chakra-ui/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../services/api';

export default function CheckIn() {
  const [scanning, setScanning] = useState(false);
  const toast = useToast();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    try {
      const response = await api.post('/api/attendance/checkin', {
        qrCode: decodedText,
      });

      toast({
        title: 'Check-in successful',
        description: `Welcome to ${response.data.conferenceName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Stop scanning after successful check-in
      if (scannerRef.current) {
        scannerRef.current.clear();
        setScanning(false);
      }
    } catch (error: any) {
      toast({
        title: 'Check-in failed',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startScanning = () => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(handleScanSuccess, (error) => {
      console.error(error);
    });

    scannerRef.current = scanner;
    setScanning(true);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      setScanning(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Heading size="lg">Conference Check-in</Heading>

        {scanning ? (
          <Box w="100%" maxW="400px">
            <div id="qr-reader" style={{ width: '100%' }}></div>
            <Button
              mt={4}
              colorScheme="red"
              w="100%"
              onClick={stopScanning}
            >
              Stop Scanning
            </Button>
          </Box>
        ) : (
          <VStack spacing={4}>
            <Text>Click below to start scanning QR codes</Text>
            <Button
              colorScheme="teal"
              onClick={startScanning}
            >
              Start Scanning
            </Button>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
