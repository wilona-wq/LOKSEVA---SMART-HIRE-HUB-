# LOKSEVA - Quick Start Guide

## 🚀 Start the Application in 3 Steps

### Prerequisites
- Node.js installed
- MongoDB running locally OR MongoDB Atlas connection string
- Two terminal windows

### Step 1: Install & Start Backend

```bash
# Terminal 1
cd Backend
npm install          # Only needed first time
npm run dev          # Starts backend on http://localhost:3000
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:3000
```

### Step 2: Configure Backend

Edit `Backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/lokseva
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=development
```

### Step 3: Start Frontend

```bash
# Terminal 2
cd Frontend

# Using Python (if available)
python -m http.server 3000 --directory .

# OR Using Node http-server
npm install -g http-server
http-server . -p 3000
```

**Then open in browser:**
```
http://localhost:3000
```

## 🧪 Test the Application

### 1. Register a New User
1. Click "Register" on index.html
2. Choose "USER" role
3. Fill all fields
4. Click "Register as User"
5. **Check Terminal 1 for OTP** (6 digits)
6. Enter OTP and click "Verify OTP"
7. Success! Redirects to login

### 2. Login & View Dashboard
1. Go to login.html
2. Enter your email and password
3. Click "Login as User"
4. You'll see user dashboard with nearby providers

### 3. Register as Provider
1. Click "Register" link
2. Choose "PROVIDER" role
3. Fill all details
4. Enter OTP from terminal
5. You'll see provider dashboard

### 4. View Providers (From User Dashboard)
- User dashboard automatically loads nearby providers
- Click "View Profile" on any provider card
- Can filter by service category

## 📋 API Endpoints Reference

```
POST   /api/auth/register         - Register new user
POST   /api/auth/verify-otp       - Verify OTP
POST   /api/auth/login            - User login
GET    /api/auth/me               - Get current user (token required)

GET    /api/users/profile         - Get user profile (token required)
PUT    /api/users/profile         - Update user profile (token required)
GET    /api/users/all             - Get all users (admin only)

POST   /api/providers/create      - Create provider profile (token required)
GET    /api/providers/:id         - Get provider details
PUT    /api/providers/update      - Update provider profile (token required)
GET    /api/providers             - List all providers
POST   /api/providers/nearby      - Find nearby providers
```

## 🔐 Test Credentials

### Admin Login
- Username: `admin`
- Password: `admin123`

### Test User (after registration)
- Email: your-email@gmail.com
- Password: your-password

## 📁 Project Structure

```
LOKSEVA---SMART-HIRE-HUB/
├── Backend/
│   ├── config/           - Database config
│   ├── models/           - MongoDB schemas
│   ├── controllers/      - Business logic
│   ├── routes/           - API endpoints
│   ├── middleware/       - Auth & validation
│   ├── .env             - Environment variables
│   ├── server.js        - Main server file
│   └── package.json
│
└── Frontend/
    ├── api.js            - API utility functions
    ├── register.js       - Registration logic
    ├── login.js          - Login logic
    ├── user-dashboard.js - User dashboard logic
    ├── provider-dashboard.js
    ├── *.html           - HTML pages
    └── style.css        - Styles
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Error: Port 3000 already in use
# Solution: Change PORT in .env or kill process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### MongoDB connection error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

# Solution: Start MongoDB
mongod  # macOS/Linux with Homebrew
# OR use MongoDB Atlas and update connection string
```

### Frontend can't reach API
```
Error: Cannot connect to server

# Solutions:
1. Make sure Backend is running (Terminal 1)
2. Check API_BASE_URL in api.js is "http://localhost:3000/api"
3. Check CORS is enabled in Backend (it is by default)
```

### OTP not appearing in terminal
```
# OTP is sent to terminal in development
# Check Terminal 1 output after registration
# Look for "✅ OTP Generated: 123456"
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: "user" | "provider" | "admin",
  isVerified: Boolean,
  address: String,
  city: String,
  createdAt: Date
}
```

### Provider Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  serviceCategory: String,
  experience: Number,
  bio: String,
  rating: Number,
  hourlyRate: Number,
  availability: Boolean,
  skills: [String],
  location: { latitude, longitude },
  createdAt: Date
}
```

## 🔒 Features Implemented

✅ User Registration with OTP Verification
✅ User Login with JWT Authentication
✅ User Profile Management
✅ Provider Profile Creation & Updates
✅ Provider Discovery (All Providers)
✅ Nearby Providers Search (Geolocation)
✅ Role-Based Access Control (User/Provider/Admin)
✅ Password Hashing with Bcrypt
✅ Token-Based Authentication (JWT)
✅ Error Handling & Validation
✅ CORS Enabled
✅ Session Management

## 📈 Next Steps

1. Add real email sending (configure nodemailer)
2. Add booking system
3. Add payment integration
4. Add ratings & reviews
5. Add image uploads
6. Add chat/messaging
7. Add notifications

## 🆘 Getting Help

1. **Check Terminal Output**: Most errors are logged in terminals
2. **Browser Console**: Open DevTools (F12) → Console tab
3. **Network Tab**: Check API requests and responses (F12 → Network)
4. **Check Logs**: Look at both Backend and Frontend terminals

## ✨ Success Indicators

- [ ] Backend starts without errors
- [ ] MongoDB connects successfully
- [ ] Frontend loads at http://localhost:3000
- [ ] Can register new user
- [ ] OTP appears in terminal
- [ ] Can complete registration
- [ ] Can login with registered credentials
- [ ] Dashboard loads providers
- [ ] Can view provider profiles

---

**Happy Coding! 🎉**

For detailed information:
- Backend: See `Backend/README.md` and `Backend/SETUP.md`
- Frontend: See `Frontend/INTEGRATION_GUIDE.md`
