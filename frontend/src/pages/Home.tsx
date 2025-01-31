import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          Welcome to <br />
          <Text as={'span'} color={'teal.400'}>
            Windsurf Events
          </Text>
        </Heading>
        <Text color={textColor}>
          Join us for an exciting 4-day conference series featuring the latest
          in technology, innovation, and professional development. Register now
          to secure your spot in our limited-capacity sessions.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
        >
          {isAuthenticated ? (
            <Button
              colorScheme={'teal'}
              bg={'teal.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'teal.500',
              }}
              onClick={() => navigate('/register')}
            >
              View Conferences
            </Button>
          ) : (
            <Button
              colorScheme={'teal'}
              bg={'teal.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'teal.500',
              }}
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
