# LOKSEVA Backend - Smart Hire Hub API

A robust Node.js/Express backend with MongoDB for managing service providers and users.

## 📁 Project Structure

```
Backend/
├── config/              # Database and configuration setup
│   └── database.js     # MongoDB connection config
├── models/             # Database schemas
│   ├── User.js         # User schema (customers, providers)
│   ├── Provider.js     # Service provider profile schema
│   └── OTP.js          # OTP verification schema
├── controllers/        # Business logic
│   ├── authController.js       # Authentication logic
│   ├── userController.js       # User management
│   └── providerController.js   # Provider management
├── routes/             # API endpoints
│   ├── authRoutes.js           # Auth endpoints
│   ├── userRoutes.js           # User endpoints
│   └── providerRoutes.js       # Provider endpoints
├── middleware/         # Custom middleware
│   └── auth.js         # JWT authentication & authorization
├── utils/              # Utility functions
├── .env                # Environment variables
├── server.js           # Main server file
└── package.json        # Dependencies
```

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with required variables:
```env
MONGODB_URI=mongodb://localhost:27017/lokseva
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=development
```

3. Start MongoDB:
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
```

4. Run the server:
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires token)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/all` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Providers
- `POST /api/providers/create` - Create provider profile
- `GET /api/providers/:id` - Get provider profile
- `PUT /api/providers/update` - Update provider profile
- `GET /api/providers` - List all available providers
- `POST /api/providers/nearby` - Find nearby providers
- `DELETE /api/providers/:id` - Delete provider (admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register a user to get an OTP
2. Verify OTP to create account and receive JWT token
3. Include token in headers for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 👥 User Roles

- **user** - Regular customers
- **provider** - Service providers
- **admin** - System administrators

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **nodemailer** - Email sending

## 🛠️ Development

### Run with auto-reload:
```bash
npm run dev
```

### Required Node version:
- Node.js 14+

## 📝 Notes

- OTP is valid for 10 minutes
- Passwords are hashed using bcrypt (salt: 10)
- JWT tokens expire after 7 days (configurable)
- Provider profiles support service categories, ratings, and location-based search

## 🤝 Contributing

Follow the existing code structure and add new routes, controllers, and models as needed.

## 📧 Support

For issues or questions, reach out to the development team.
