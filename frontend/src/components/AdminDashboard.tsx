import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { api } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ConferenceStats {
  id: number;
  title: string;
  capacity: number;
  currentAttendance: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<ConferenceStats[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const toast = useToast();
  const ws = useWebSocket();

  useEffect(() => {
    fetchStats();
    
    ws?.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATS_UPDATE') {
        updateStats(data.conferenceId, data.stats);
      }
    });
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/conferences/stats', {
        params: { date: selectedDate }
      });
      setStats(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching statistics',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const updateStats = (conferenceId: number, newStats: Partial<ConferenceStats>) => {
    setStats(prev => prev.map(stat => 
      stat.id === conferenceId ? { ...stat, ...newStats } : stat
    ));
  };

  const exportData = async () => {
    try {
      const response = await api.get('/conferences/export', {
        params: { date: selectedDate },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `conference-stats-${selectedDate || 'all'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error exporting data',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const chartData = {
    labels: stats.map(stat => stat.title),
    datasets: [
      {
        label: 'Attendance',
        data: stats.map(stat => stat.currentAttendance),
        backgroundColor: 'rgba(0, 199, 183, 0.5)',
        borderColor: 'rgba(0, 199, 183, 1)',
        borderWidth: 1,
      },
      {
        label: 'Capacity',
        data: stats.map(stat => stat.capacity),
        backgroundColor: 'rgba(42, 42, 42, 0.5)',
        borderColor: 'rgba(42, 42, 42, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Conference Attendance vs Capacity',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box p={6}>
      <Grid templateColumns="1fr auto" gap={4} mb={6}>
        <Select
          placeholder="Select date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {/* Add date options dynamically */}
        </Select>
        <Button colorScheme="teal" onClick={exportData}>
          Export Data
        </Button>
      </Grid>

      <Box mb={8}>
        <Bar data={chartData} options={chartOptions} />
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {stats.map(stat => (
          <Box
            key={stat.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            shadow="sm"
          >
            <Heading size="sm" mb={2}>{stat.title}</Heading>
            <Text>Attendance: {stat.currentAttendance}/{stat.capacity}</Text>
            <Text>Average Rating: {stat.averageRating.toFixed(1)}/5</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
