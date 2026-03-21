# 🚀 Quick Start Guide - Dynamic Dashboards

## Prerequisites
Make sure MongoDB is running locally (or update MONGO_URI in .env)

## Step 1: Start the Backend Server
```bash
cd Backend
npm install  # if not already done
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:3000
```

## Step 2: Access the Application
Open browser and go to: `http://localhost:3000`

## Step 3: Test User Registration & Dashboard

### Register a New User:
1. Click "Register"
2. Choose "User" role
3. Fill in details:
   - **Name**: John Doe (or any name you want)
   - **Email**: johndoe@gmail.com
   - **Phone**: 9876543210
   - **Password**: Test@123456
4. Check terminal for OTP, enter it
5. **Verify**: Dashboard shows "Hello, John Doe! 👋"
6. **Check navbar**: Shows "👤 John Doe"

### Test User Profile:
1. Click "Edit Profile"
2. Change name to "John Smith"
3. Save changes
4. Go back to dashboard
5. **Verify**: Name updates to "Hello, John Smith! 👋"

## Step 4: Test Provider Registration & Dashboard

### Register a New Provider:
1. Go back to login page
2. Click "Register"
3. Choose "Provider" role
4. Fill in details:
   - **Name**: Raj Sharma (or any name)
   - **Email**: raj@gmail.com
   - **Phone**: 9876543211
   - **Password**: Test@123456
5. Enter OTP from terminal
6. **Verify**: Dashboard shows "Hello, Raj Sharma! 👋"

## Step 5: Test Admin Dashboard

### Login as Admin:
1. Go to login page
2. Tab to "Admin" section
3. Enter:
   - **Username**: admin
   - **Password**: admin123
4. **Verify**: Redirects to admin dashboard

### Check Admin Dashboard:
- **User count should update**: Shows number of real registered users
- **Provider count should update**: Shows number of registered providers
- **Users table**: Shows "John Doe" (the user you registered)
- **Providers table**: Shows "Raj Sharma" (the provider you registered)
- **Block/Unblock buttons**: Should be functional

## Step 6: Test Dynamic Updates

### Register Another User:
1. Open a new browser tab
2. Register a new user with name "Alice Johnson"
3. In admin dashboard (don't refresh), click "Logout" then login again as admin
4. **Verify**: User count incremented
5. **Verify**: "Alice Johnson" appears in users table

## MongoDB Verification

To verify data is being stored:

### Using MongoDB Compass or mongosh:
```bash
# Connect to MongoDB
mongosh

# Switch to database
use lokseva_db

# Check user collection
db.users.find().pretty()

# Should see:
# {
#   _id: ObjectId(...),
#   name: "John Doe",
#   email: "johndoe@gmail.com",
#   phone: "9876543210",
#   role: "user",
#   ...
# }
```

## Troubleshooting

### 1. Dashboard shows "User" instead of actual name
- **Solution**: Check browser console (F12) for errors
- Make sure backend is running
- Verify token is being sent in Authorization header

### 2. Admin dashboard shows no users/providers
- Check that backend is running and MongoDB is connected
- Open DevTools Network tab, check `/api/users/all` response
- Verify admin has correct role in localStorage

### 3. Admin login not redirecting to admin dashboard
- Check that ADMIN_USER and ADMIN_PASS are set correctly:
  - Username: `admin`
  - Password: `admin123`
- Clear localStorage and try again

### 4. Block/Unblock buttons not working
- **Note**: We may need to add an endpoint in the backend to update status
- For now, functionality attempts to call the API
- This can be extended later

## Data Being Stored in MongoDB ✅

When a user registers, MongoDB stores:
```javascript
{
  name: "John Doe",          // ← Display on dashboard
  email: "john@gmail.com",
  phone: "9876543210",
  password: "hashed...",
  role: "user",              // ← Determines which dashboard
  address: "",
  city: "",
  isVerified: true,
  createdAt: Date
}
```

## Features Working ✅

- [x] User registration → Data stored in MongoDB
- [x] User login → Name displayed on dashboard
- [x] Provider registration → Data stored in MongoDB
- [x] Provider dashboard → Shows provider's name
- [x] Admin login → Access to admin dashboard
- [x] Admin dashboard → Shows all users from MongoDB
- [x] Admin dashboard → Shows all providers from MongoDB
- [x] User count → Dynamic from MongoDB
- [x] Provider count → Dynamic from MongoDB
- [x] Edit profile → Changes persist in MongoDB

## Next Enhancements (Optional)

1. Add provider profile creation endpoint
2. Add status update endpoints for block/unblock
3. Add pagination for user/provider tables
4. Add search/filter functionality
5. Add more admin features (statistics, charts, etc)

---

**Everything is ready to test!** 🎉

Start with the User Registration → Dashboard flow to see names display dynamically from MongoDB.
