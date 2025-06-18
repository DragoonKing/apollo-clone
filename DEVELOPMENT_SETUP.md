# Apollo247 Clone - Development Setup

## Project Structure

This project has been restructured to support independent frontend and backend development:

```
apollo247-clone/
├── client/                 # React frontend application
│   ├── src/               # Frontend source code
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration with proxy
│   └── .env               # Frontend environment variables
├── server/                # Express backend application
│   ├── *.ts               # Backend source files
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # Backend TypeScript config
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod schemas for data validation
└── package.json           # Root package with scripts for both
```

## Development Commands

### Start Both Client and Server (Recommended)
```bash
npm run dev
```
This runs both frontend (port 5173) and backend (port 3001) concurrently.

### Individual Development

#### Frontend Only
```bash
cd client
npm install
npm run dev
```
- Runs on http://localhost:5173
- Proxies API calls to backend
- Hot reload enabled

#### Backend Only
```bash
cd server
npm install  
npm run dev
```
- Runs on http://localhost:3001
- Standalone Express server
- API endpoints available at /api/*

## Environment Configuration

### Client (.env)
```
VITE_API_URL=http://localhost:3001
```

### Server
Uses environment variables from root:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (defaults to 3001)

## API Communication

The frontend communicates with the backend through:
1. **Development**: Vite proxy configuration (`/api` → `http://localhost:3001`)
2. **Production**: Direct API calls using `VITE_API_URL`

## Database

- MongoDB connection configured in `server/storage.ts`
- Existing data preserved (12 doctors currently stored)
- Real-time filtering and search functionality maintained

## Key Features Maintained

- ✅ Doctor listing with real-time filtering
- ✅ Search by name, city, gender, experience, rating
- ✅ Add new doctors with form validation
- ✅ Professional Apollo247-style UI
- ✅ MongoDB data persistence
- ✅ SEO optimization and responsive design

## Development Benefits

1. **Independent Development**: Frontend and backend can be developed separately
2. **Hot Reload**: Both client and server support hot reload during development
3. **Type Safety**: Shared schemas ensure type consistency
4. **Flexible Deployment**: Can deploy frontend and backend to different services
5. **Team Collaboration**: Multiple developers can work on different parts simultaneously

## Build and Deployment

### Build Both
```bash
npm run build
```

### Individual Builds
```bash
# Frontend
cd client && npm run build

# Backend  
cd server && npm run build
```

The separated architecture maintains all existing functionality while enabling modern development workflows and team collaboration.