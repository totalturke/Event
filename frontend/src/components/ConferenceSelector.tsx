import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Button,
  useToast,
  Badge,
  VStack
} from '@chakra-ui/react';
import { Conference } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../services/api';

interface ConferenceSelectorProps {
  onSelectConference: (conferenceIds: number[]) => void;
}

export default function ConferenceSelector({ onSelectConference }: ConferenceSelectorProps) {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConferences, setSelectedConferences] = useState<number[]>([]);
  const toast = useToast();
  const ws = useWebSocket();

  useEffect(() => {
    fetchConferences();
    
    // WebSocket updates
    ws?.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CONFERENCE_UPDATE') {
        updateConferenceCapacity(data.conferenceId, data.currentAttendance);
      }
    });
  }, []);

  const fetchConferences = async () => {
    try {
      const response = await api.get('/conferences');
      setConferences(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching conferences',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const updateConferenceCapacity = (conferenceId: number, currentAttendance: number) => {
    setConferences(prev => prev.map(conf => 
      conf.id === conferenceId 
        ? { ...conf, currentAttendance } 
        : conf
    ));
  };

  const toggleConference = (conferenceId: number) => {
    setSelectedConferences(prev => {
      const isSelected = prev.includes(conferenceId);
      const conference = conferences.find(c => c.id === conferenceId);
      
      if (!conference) return prev;
      
      if (isSelected) {
        return prev.filter(id => id !== conferenceId);
      } else {
        if (conference.currentAttendance >= conference.capacity) {
          toast({
            title: 'Conference is full',
            status: 'error',
            duration: 3000,
          });
          return prev;
        }
        return [...prev, conferenceId];
      }
    });
  };

  const groupedConferences = conferences.reduce((acc, conf) => {
    const date = new Date(conf.datetime).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(conf);
    return acc;
  }, {} as Record<string, Conference[]>);

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {Object.entries(groupedConferences).map(([date, dayConferences]) => (
        <Box key={date} p={4} borderWidth={1} borderRadius="lg">
          <Heading size="md" mb={4}>{date}</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
            {dayConferences.map(conference => {
              const isSelected = selectedConferences.includes(conference.id);
              const isFull = conference.currentAttendance >= conference.capacity;
              
              return (
                <Box
                  key={conference.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  borderColor={isSelected ? 'teal.500' : 'gray.200'}
                  onClick={() => toggleConference(conference.id)}
                  cursor="pointer"
                  _hover={{ shadow: 'md' }}
                >
                  <Text fontWeight="bold">{conference.title}</Text>
                  <Text fontSize="sm">
                    {new Date(conference.datetime).toLocaleTimeString()}
                  </Text>
                  <Badge 
                    colorScheme={isFull ? 'red' : 'green'}
                  >
                    {conference.currentAttendance}/{conference.capacity} spots
                  </Badge>
                </Box>
              );
            })}
          </Grid>
        </Box>
      ))}
      
      <Button
        colorScheme="teal"
        isDisabled={selectedConferences.length === 0}
        onClick={() => onSelectConference(selectedConferences)}
      >
        Register for Selected Conferences
      </Button>
    </VStack>
  );
}
