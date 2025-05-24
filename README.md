# Express Server with Authentication and Gemini AI Integration

A full-stack web application built with Express.js that features user authentication and integrates Google's Gemini AI for generating responses to user messages.

## Features

- User Authentication (JWT-based)
- Gemini AI Integration
- File Management System
- Secure Cookie-based Sessions
- CORS Support
- MongoDB Database Integration
- Environment Variable Configuration

## Project Structure

```
├── controllers/     # Route controllers
├── db/             # Database configuration
├── js/             # Client-side JavaScript
├── middleware/     # Custom middleware (auth, etc.)
├── models/         # Database models
├── public/         # Static files (HTML, CSS)
├── routes/         # API routes
├── storage/        # File storage
├── utils/          # Utility functions
├── .env            # Environment variables
├── .gitignore      # Git ignore rules
├── index.js        # Application entry point
├── package.json    # Project dependencies
└── server.js       # Server configuration
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB
- Google Gemini API key

## Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- Cookie Parser - Cookie handling
- CORS - Cross-origin resource sharing
- Dotenv - Environment variables
- Google Generative AI - Gemini AI integration
- Bcryptjs - Password hashing

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Chat
- `POST /api/chat` - Send message to Gemini AI
  ```json
  {
    "message": "Your message here"
  }
  ```

### Health Check
- `GET /health` - Server health check
  ```json
  {
    "status": "OK"
  }
  ```

## Security Features

- JWT-based authentication
- Secure cookie handling
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- Input validation
- Error handling middleware

## Development

- Development server with hot reload: `npm run dev`
- Production build: `npm start`

## Error Handling

The application includes comprehensive error handling for:
- Authentication failures
- Invalid API requests
- Database connection issues
- File system operations
- AI service integration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 