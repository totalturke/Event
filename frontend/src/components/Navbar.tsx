import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => navigate('/')}
        >
          Windsurf Events
        </Text>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                )}
                <Button onClick={() => navigate('/register')}>Conferences</Button>
                <Button onClick={() => navigate('/checkin')}>Check-in</Button>
                <Button onClick={logout}>Logout</Button>
              </>
            ) : (
              <Button onClick={() => navigate('/login')}>Login</Button>
            )}
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
