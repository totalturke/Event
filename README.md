# Windsurf Event Manager

A comprehensive event management system for managing 4-day conferences with features including QR-based check-in, real-time attendance tracking, and post-event surveys.

## Features

- Conference registration with real-time capacity tracking
- Dynamic QR code generation for attendee check-in
- Real-time attendance monitoring via WebSocket
- Post-event survey collection and analysis
- Administrative dashboard with analytics
- CSV export functionality

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Containerization: Docker + Docker Compose
- UI Framework: Chakra UI
- Real-time updates: WebSocket

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or higher (for local development)
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd windsurf-event-manager
   ```

2. Create a `.env` file in the root directory:
   ```
   DB_PASSWORD=your_secure_password
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```

4. The application will be available at:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Database: localhost:5432

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Architecture

- `/frontend`: React application with TypeScript
- `/backend`: Node.js/Express server
- `/infra`: Docker and deployment configurations

## API Documentation

### Main Endpoints

- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User authentication
- `GET /api/conferences`: List all conferences
- `POST /api/attendance/checkin`: QR code check-in
- `GET /api/surveys/:conferenceId`: Get survey results
- `GET /api/conferences/stats`: Get conference statistics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
