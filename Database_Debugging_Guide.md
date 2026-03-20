# 🔍 Database Debugging Guide

## Issue: User Data Not ShowingIn Database

### Root Causes Found & Fixed:

1. **Pre-save Hook Bug** ✅ FIXED
   - In `Backend/models/User.js`, the password hashing pre-save hook had a bug
   - It called `next()` without `return`, causing the function to continue executing
   - Failed to catch errors from bcrypt hashing
   - **Fix Applied:** Added proper `return next()` and error handling

2. **Missing Error Logging** ✅ FIXED
   - Backend wasn't logging when user creation succeeded/failed
   - No visibility into what was being saved
   - **Fix Applied:** Added detailed console logs in authController:
     - Logs user data before saving
     - Logs user ID after successful creation
     - Logs full error details if save fails

---

## 🧪 How to Test & Debug

### **Test 1: Check Browser Network Tab**
1. Open browser (http://localhost:8000)
2. Press F12 → Go to **Network** tab
3. Register a new user
4. Watch the network requests:
   - `POST /api/auth/register` → Should return status **200**
   - `POST /api/auth/verify-otp` → Should return status **201** with token
5. ✅ If both return success, backend received and responded correctly

### **Test 2: Check Backend Terminal Logs**
1. Go to Terminal running Backend (`npm run dev`)
2. Register a new user
3. Look for these logs:
   - `✅ OTP Generated: 123456`
   - `📝 Creating user with data: { name: '...', email: '...', ... }`
   - `✅ User created successfully: <user_id> <email>`
4. ✅ If all three appear, user was saved to database

### **Test 3: Browser Console Check**
1. Register → Verify OTP
2. Press F12 → **Console** tab
3. No red error messages = frontend sent data correctly

### **Test 4: Direct Database Query** (If you have MongoDB CLI)

```bash
# Connect to MongoDB
mongosh

# Select database
use lokseva

# Find all users
db.users.find().pretty()

# Find specific user by email
db.users.findOne({ email: "your-email@gmail.com" })

# Count total users
db.users.countDocuments()
```

---

## 🚨 Troubleshooting Steps

### **If Users Still Not Saving:**

**Step 1: Verify MongoDB Connection**
- Check Backend Terminal for: `✅ MongoDB connected successfully`
- If no message: MongoDB not running

**Step 2: Check Backend Logs for Errors**
- Look for `❌ OTP Verification Error:`
- Copy the error message

**Step 3: Common Error Solutions**

| Error | Solution |
|-------|----------|
| `E11000 duplicate key error` | User with same email already exists. Try new email. |
| `Password validation failed` | Password < 6 characters. Use longer password. |
| `MongoDB connection timeout` | MongoDB not running. Start MongoDB service. |
| `userData not found` | Frontend didn't send userData. Check register.js |
| `Invalid OTP` | Wrong OTP or OTP expired. Check terminal for correct OTP. |

---

## 📊 What Should Happen (Data Flow)

```
Frontend                          Backend                      Database
   ↓                                 ↓                            ↓
User fills form                       
       ↓
Click "Register"
       ↓ POST /auth/register         →  Save OTP to DB           ✅ OTP Saved
       ←  Return 200 + message ←
Show OTP input
       ↓
User enters OTP
       ↓
Click "Verify OTP"
       ↓ POST /auth/verify-otp       →  Create User              ✅ User Saved
       ↓ (with userData in body)  →  Delete OTP                  ✅ OTP Deleted
       ←  Return 201 + token  ←
Store token in localStorage
       ↓
Redirect to dashboard
```

---

## ✅ Success Indicators

- [ ] Backend logs show `✅ OTP Generated: 123456`
- [ ] Backend logs show `📝 Creating user with data: ...`
- [ ] Backend logs show `✅ User created successfully: <id> <email>`
- [ ] Browser console shows no errors
- [ ] Dashboard loads after login with provider data
- [ ] Can login with registered credentials
- [ ] Data persists after page refresh

---

## 🔧 If Still Having Issues

### Check These Files:
1. **Backend/.env** → `MONGODB_URI=mongodb://localhost:27017/lokseva`
2. **Backend/config/database.js** → Connection logic
3. **Backend/models/User.js** → User schema and pre-save hook
4. **Backend/controllers/authController.js** → Register/OTP verification logic
5. **Frontend/register.js** → Frontend sending correct data
6. **Frontend/api.js** → API call wrapper

### Enable More Logging:
In `Backend/server.js`, add near top:
```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body);
  next();
});
```

---

## 📝 Data Should Look Like This in Database

### User Collection (`db.users`)
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "+919876543210",
  "password": "$2b$10$...(hashed)...",
  "role": "user",
  "isVerified": true,
  "address": "",
  "city": "",
  "createdAt": ISODate("2024-03-19T10:30:00Z"),
  "updatedAt": ISODate("2024-03-19T10:30:00Z")
}
```

---

## 🎯 Next Steps

1. **Register a new user** with the improvements
2. **Watch Backend Terminal** during registration
3. **Share the log output** if it still fails
4. **Check Network tab** in browser (F12)
5. **Verify database** with MongoDB CLI if possible

**Backend is now ready with better error logging - try registering a new user and watch the terminal for detailed feedback!**
