# Frontend Integration Guide - LOKSEVA Smart Hire Hub

## 📁 Frontend Structure

The frontend has been updated with API integration files:

```
Frontend/
├── api.js                      # Core API utility functions (MAIN)
├── register.js                 # Registration form handling
├── login.js                    # Login form handling
├── user-dashboard.js           # User dashboard logic
├── provider-dashboard.js       # Provider dashboard logic
├── user-profile.js             # User profile management
├── provider-profile.js         # Provider profile management
├── nearby_providers.js         # Nearby providers search/display
│
├── register.html               # Registration page (UPDATED)
├── login.html                  # Login page (UPDATED)
├── user-dashboard.html         # User dashboard (needs script tags)
├── provider-dashboard.html     # Provider dashboard (needs script tags)
├── user_profile.html           # User profile page (needs script tags)
├── provider_profile.html       # Provider profile page (needs script tags)
├── nearby_providers.html       # Nearby providers page (needs script tags)
└── index.html                  # Landing page
```

## 🔧 How to Use

### 1. API Configuration
The API base URL is set to `http://localhost:3000/api` in `api.js`. Make sure your backend is running on port 3000.

### 2. Script Inclusion
Each HTML page needs to include the API scripts. Add these lines before the closing `</body>` tag:

```html
<!-- API Integration Scripts -->
<script src="api.js"></script>
<script src="specific-page.js"></script>
```

### 3. Authentication
- Users are automatically authenticated using JWT tokens stored in `localStorage`
- Sensitive pages call `requireAuth()` which redirects to login if no token is found
- Tokens are included automatically in all API requests via the `Authorization` header

### 4. Key Functions

#### Authentication Functions
```javascript
registerUser(userData)           // Register new user
verifyUserOTP(email, otp)       // Verify OTP after registration
loginUser(email, password)      // User login
getCurrentUser()                // Get authenticated user
logout()                        // Clear auth data and redirect
```

#### User Profile Functions
```javascript
getUserProfile()                // Get user's full profile
updateUserProfile(profileData)  // Update user profile
```

#### Provider Functions
```javascript
createProviderProfile(data)     // Create provider profile
getProviderProfile(providerId)  // Get specific provider
updateProviderProfile(data)     // Update provider profile
getAllProviders(filters)        // Get all providers with filters
getNearbyProviders(lat, lon)   // Get providers within distance
```

## 📝 HTML Page Requirements

### Pages That Need Script Tags

**1. user-dashboard.html**
```html
<script src="api.js"></script>
<script src="user-dashboard.js"></script>
```

**2. provider-dashboard.html**
```html
<script src="api.js"></script>
<script src="provider-dashboard.js"></script>
```

**3. user_profile.html**
```html
<script src="api.js"></script>
<script src="user-profile.js"></script>
```

**4. provider_profile.html**
```html
<script src="api.js"></script>
<script src="provider-profile.js"></script>
```

**5. nearby_providers.html**
```html
<script src="api.js"></script>
<script src="nearby_providers.js"></script>
```

## 🔐 Authentication Flow

### User Registration
1. User fills registration form
2. Frontend validates input
3. Sends to `/api/auth/register`
4. Backend generates OTP and saves user data in session
5. Frontend shows OTP input field
6. User enters OTP → `/api/auth/verify-otp`
7. Backend creates user in MongoDB
8. Returns JWT token
9. Token stored in localStorage
10. User redirected to dashboard

### User Login
1. User enters email and password
2. Frontend validates input
3. Sends to `/api/auth/login`
4. Backend verifies credentials
5. Returns JWT token
6. Token stored in localStorage
7. User redirected to dashboard based on role

## 💾 Data Storage

### localStorage Keys
```javascript
authToken       // JWT token for API requests
user           // User object (id, name, email, role)
```

### User Object Structure
```javascript
{
  id: "63f7d1c2e4b0a1234567890ab",
  name: "John Doe",
  email: "john@gmail.com",
  role: "user"  // or "provider"
}
```

## 🚀 Starting the Full Stack

**Terminal 1 - Start Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
# Serve Frontend folder via local server (Python)
python -m http.server 3000 --directory Frontend
# OR use Node.js http-server
npx http-server Frontend -p 3000
```

Then open: `http://localhost:3000`

## 🐛 Common Issues & Solutions

### "API Error" or "Cannot connect to server"
- ❌ Backend not running
- ✅ Solution: Run `npm run dev` in Backend folder

### "Token expired"
- ❌ JWT token expired (7 days by default)
- ✅ Solution: User needs to login again

### "User not found" after login
- ❌ User registered but database had issues
- ✅ Solution: Re-register or check MongoDB connection

### Form submissions not working
- ❌ JavaScript errors in browser console
- ❌ HTML form not including correct script files
- ✅ Solution: Check browser DevTools > Console for errors

### "Authorization failed"
- ❌ Missing or invalid JWT token
- ❌ User role doesn't match required role
- ✅ Solution: Clear localStorage and login again

## 📋 Testing Checklist

- [ ] Backend is running on port 3000
- [ ] MongoDB is connected
- [ ] Frontend can be accessed via http://localhost:3000
- [ ] Registration works (check terminal for OTP)
- [ ] OTP verification works
- [ ] Login works
- [ ] User dashboard loads and shows providers
- [ ] Provider profile can be created/updated
- [ ] Nearby providers search works (requires geolocation)

## 🔔 Important Notes

1. **CORS**: Backend has CORS enabled for localhost
2. **Geolocation**: Some features require user to allow geolocation access
3. **Validation**: Frontend validates input before sending to backend
4. **Errors**: Check browser console (F12) for error messages
5. **Development**: Admin account for testing:
   - Username: `admin`
   - Password: `admin123`

## 📚 API Reference

See [Backend/README.md](../Backend/README.md) for complete API endpoint documentation.

## 🆘 Need Help?

1. Check browser console (F12) for JavaScript errors
2. Check Network tab to see API requests/responses
3. Check Backend console for server-side errors
4. Ensure MongoDB is running (`mongod` in separate terminal)
5. Verify JSON format in request bodies

---

**Last Updated:** March 2026
