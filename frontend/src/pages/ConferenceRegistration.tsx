import { useState } from 'react';
import {
  Container,
  Heading,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ConferenceSelector from '../components/ConferenceSelector';
import QRDisplayModal from '../components/QRDisplayModal';
import { api } from '../services/api';

export default function ConferenceRegistration() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentQR, setCurrentQR] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleConferenceSelection = async (conferenceIds: number[]) => {
    try {
      const response = await api.post('/api/conferences/register', {
        conferenceIds,
      });

      const { qrCode, conferenceName } = response.data;
      setCurrentQR(qrCode);
      setConferenceName(conferenceName);
      setIsQRModalOpen(true);

      toast({
        title: 'Registration successful',
        description: 'Your QR code has been generated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Conference Registration</Heading>
      </Box>

      <ConferenceSelector onSelectConference={handleConferenceSelection} />

      <QRDisplayModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrData={currentQR}
        conferenceName={conferenceName}
      />
    </Container>
  );
}
