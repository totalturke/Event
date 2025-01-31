import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ConferenceRegistration from './pages/ConferenceRegistration';
import CheckIn from './pages/CheckIn';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<ConferenceRegistration />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
