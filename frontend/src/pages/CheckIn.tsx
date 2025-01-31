import { useState } from 'react';
import {
  Container,
  Heading,
  VStack,
  Button,
  Text,
  useToast,
  Box,
} from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import { api } from '../services/api';

export default function CheckIn() {
  const [scanning, setScanning] = useState(false);
  const toast = useToast();

  const handleScan = async (result: any) => {
    if (result) {
      try {
        const response = await api.post('/api/attendance/checkin', {
          qrCode: result.text,
        });

        toast({
          title: 'Check-in successful',
          description: `Welcome to ${response.data.conferenceName}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Stop scanning after successful check-in
        setScanning(false);
      } catch (error: any) {
        toast({
          title: 'Check-in failed',
          description: error.response?.data?.message || 'Please try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    toast({
      title: 'Camera Error',
      description: 'Error accessing camera',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Heading size="lg">Conference Check-in</Heading>

        {scanning ? (
          <Box w="100%" maxW="400px">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={handleScan}
              onError={handleError}
              containerStyle={{ width: '100%' }}
            />
            <Button
              mt={4}
              colorScheme="red"
              w="100%"
              onClick={() => setScanning(false)}
            >
              Stop Scanning
            </Button>
          </Box>
        ) : (
          <VStack spacing={4}>
            <Text>Click below to start scanning QR codes</Text>
            <Button
              colorScheme="teal"
              onClick={() => setScanning(true)}
            >
              Start Scanning
            </Button>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
