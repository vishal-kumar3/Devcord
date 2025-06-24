# Devcord

A modern, real-time communication platform designed for developers, built with cutting-edge technologies and a focus on performance and scalability.

## Description

Devcord is a Discord-inspired communication platform tailored for developers and teams. It provides real-time messaging, friend management, project collaboration, and seamless integration with developer tools like GitHub. Built as a full-stack application with a microservices architecture, Devcord offers a robust foundation for team communication and project management.

## Features

### Authentication & User Management
- **GitHub OAuth Integration** - Seamless login with GitHub accounts
- **User Profiles** - Customizable profiles with avatars, banners, and bio
- **Session Management** - Secure authentication with NextAuth.js

### Real-time Messaging
- **Instant Messaging** - Real-time chat with Socket.IO
- **Message Reactions** - React to messages with emojis
- **Message Editing & Deletion** - Full message management capabilities
- **Typing Indicators** - See when others are typing
- **File Attachments** - Share images, videos, and documents
- **Message History** - Persistent message storage

### Social Features
- **Friend System** - Send, accept, and manage friend requests
- **Direct Messages** - Private conversations between users
- **Group Conversations** - Multi-user chat rooms
- **Member Management** - Add/remove members from conversations
- **Online Status** - Real-time user presence indicators

### Project Collaboration
- **Project Channels** - Organized communication spaces
- **Channel Management** - Create and manage different project channels
- **Team Collaboration** - Built for developer teams and projects

### User Experience
- **Dark Theme** - Developer-friendly dark interface
- **Responsive Design** - Works seamlessly across devices
- **Modern UI** - Built with Tailwind CSS and Radix UI components
- **Emoji Support** - Rich emoji picker and reactions
- **File Preview** - In-app preview for images and videos

### Developer Features
- **GitHub Integration** - Connect with GitHub repositories
- **Developer Command Palette** - Quick actions and navigation
- **Real-time Notifications** - Stay updated with toast notifications

## Technologies Used

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Socket.IO Client](https://socket.io/)** - Real-time communication
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation
- **[ImageKit](https://imagekit.io/)** - Image optimization and management

### Backend
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[Socket.IO](https://socket.io/)** - Real-time bidirectional communication
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe backend development

### Database & Infrastructure
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database
- **[Prisma](https://www.prisma.io/)** - Database ORM and migrations
- **[Redis](https://redis.io/)** - Caching and session storage
- **[Apache Kafka](https://kafka.apache.org/)** - Message streaming and event processing

### Development & Deployment
- **[Turborepo](https://turbo.build/)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Docker](https://www.docker.com/)** - Containerization
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## Project Structure

```
devcord/
├── apps/
│   ├── frontend/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/             # App Router pages and layouts
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── actions/         # Server actions
│   │   │   ├── providers/       # Context providers
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── lib/             # Utility libraries
│   │   │   └── utils/           # Helper functions
│   │   └── public/              # Static assets
│   │
│   └── backend/                 # Express.js backend application
│       ├── src/
│       │   ├── config/          # Configuration files
│       │   ├── events/          # Socket.IO event handlers
│       │   ├── services/        # Business logic services
│       │   └── utils/           # Backend utilities
│       └── dist/                # Compiled JavaScript
│
├── packages/
│   ├── node-prisma/             # Shared Prisma schema and types
│   │   ├── prisma/              # Database schema and migrations
│   │   └── src/                 # Shared types and actions
│   │
│   ├── eslint-config/           # Shared ESLint configurations
│   └── typescript-config/       # Shared TypeScript configurations
│
├── docker-compose.yml           # Development services
├── turbo.json                   # Turborepo configuration
├── pnpm-workspace.yaml          # pnpm workspace configuration
└── package.json                 # Root package configuration
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v9.0.0 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** database
- **Redis** server
- **Apache Kafka** (optional, for message streaming)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devcord.git
   cd devcord
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development services**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**
   
   Create `.env` files in the respective directories:
   
   **Frontend** (`apps/frontend/.env.local`):
   ```env
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   DATABASE_URL=postgresql://devcord:devcord@localhost:5432/devcord
   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
   IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
   ```
   
   **Backend** (`apps/backend/.env`):
   ```env
   DATABASE_URL=postgresql://devcord:devcord@localhost:5432/devcord
   REDIS_URL=redis://localhost:6379
   KAFKA_BROKERS=localhost:9092
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Set up the database**
   ```bash
   cd packages/node-prisma
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

6. **Start the development servers**
   ```bash
   pnpm dev
   ```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications for production
- `pnpm start` - Start all applications in production mode
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Format code with Prettier

## Architecture

Devcord follows a modern microservices architecture:

- **Frontend**: Next.js application with server-side rendering and static generation
- **Backend**: Express.js API server with Socket.IO for real-time features
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Caching**: Redis for session storage and real-time data
- **Message Queue**: Apache Kafka for handling message streaming and event processing
- **Monorepo**: Turborepo for efficient build and development workflows

## API Documentation

### Socket.IO Events

#### Conversation Events
- `conversation:message` - Send/receive messages
- `conversation:typing` - Typing indicators
- `conversation:edit-message` - Edit messages
- `conversation:delete-message` - Delete messages
- `conversation:react-message` - Message reactions
- `conversation:add-members` - Add members to conversation
- `conversation:remove-members` - Remove members from conversation

#### Friend Events
- `friend:request` - Send friend requests
- `friend:accept` - Accept friend requests
- `friend:remove` - Remove friends

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts and profiles
- **Account** - OAuth account linking
- **Conversation** - Chat rooms and direct messages
- **Message** - Chat messages with attachments
- **FriendRequest** - Friend relationship management
- **Project** - Project workspaces
- **Reaction** - Message reactions

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Architecture Principles
- Keep components small and focused
- Use server actions for data mutations
- Implement proper error handling
- Follow React best practices

## Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
Ensure all required environment variables are set in production:
- Database connections
- Authentication secrets
- External service API keys
- CORS origins

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL environment variable
   - Run `pnpm prisma migrate dev`

2. **Socket.IO Connection Problems**
   - Verify CORS settings
   - Check Redis connection
   - Ensure backend server is running

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

## Performance Considerations

- **Database**: Proper indexing on frequently queried fields
- **Caching**: Redis for session and real-time data
- **Real-time**: Socket.IO with Redis adapter for scaling
- **Images**: ImageKit for optimization and CDN delivery
- **Build**: Turborepo for efficient monorepo builds

## Security

- **Authentication**: Secure OAuth with NextAuth.js
- **Authorization**: Role-based access control
- **Data Validation**: Zod schemas for input validation
- **CORS**: Properly configured cross-origin requests
- **Environment**: Secure environment variable management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Discord's user experience and design
- Built with modern web technologies and best practices
- Thanks to the open-source community for the amazing tools and libraries

## Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Join our community discussions
- Check out the documentation

---

**Built with ❤️ for developers, by developers**