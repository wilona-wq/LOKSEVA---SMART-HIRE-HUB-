# Backend Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

2. **MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Postman** (optional, for API testing)
   - Download from: https://www.postman.com/downloads/

## Installation Steps

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the Backend folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lokseva

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Email Configuration (optional)
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@lokseva.com

# Server
NODE_ENV=development
PORT=3000
```

### 3. Start MongoDB

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
```

**Or use MongoDB Atlas:**
- Replace `MONGODB_URI` with your connection string from Atlas

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at: `http://localhost:3000`

## Folder Structure Explanation

| Folder | Purpose |
|--------|---------|
| `config/` | Database connection and configuration |
| `models/` | Database schemas (User, Provider, OTP) |
| `controllers/` | Business logic for API endpoints |
| `routes/` | API route definitions |
| `middleware/` | Authentication and authorization |
| `utils/` | Helper functions and utilities |

## Testing the API

### Using Postman:

1. **Register a User**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Body:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "1234567890",
     "password": "password123",
     "role": "user"
   }
   ```

2. **Verify OTP**
   - Check terminal for generated OTP
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/verify-otp`
   - Body:
   ```json
   {
     "email": "john@example.com",
     "otp": "123456"
   }
   ```

3. **Login**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body:
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

4. **Get User Profile**
   - Method: `GET`
   - URL: `http://localhost:3000/api/users/profile`
   - Headers:
   ```
   Authorization: Bearer <token_from_login>
   ```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Try connection string: `mongodb://127.0.0.1:27017/lokseva`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Connect frontend to API endpoints
2. Add email verification (configure nodemailer)
3. Implement booking system
4. Add ratings and reviews
5. Setup payment integration
