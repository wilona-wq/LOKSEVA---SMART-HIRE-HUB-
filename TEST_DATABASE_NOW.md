# 🧪 User Data Database Test Procedure

## ✅ Backend Status
- ✅ MongoDB connected successfully
- ✅ Server running on http://localhost:3000
- ✅ Improvements applied:
  - Fixed password hashing pre-save hook
  - Added detailed error logging
  - Better error handling

---

## 📋 Test Steps - Follow These Exactly

### **Step 1: Keep Backend Terminal Open**
Make sure you can see the backend logs. You should see:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:3000
```

### **Step 2: Register a New User**
1. Go to `http://localhost:8000/register.html`
2. Select **USER** role
3. Fill the form with:
   - **Name:** TestUser2024
   - **Email:** testuser2024@gmail.com (use unique email)
   - **Phone:** 9876543210
   - **Password:** Test@123456
   - **Confirm:** Test@123456
4. Click **"Register as USER"**

### **Step 3: Watch Backend Terminal**
Look for these messages (in order):
```
✅ OTP Generated: 123456
📝 Creating user with data: { name: 'TestUser2024', email: 'testuser2024@gmail.com', ... }
✅ User created successfully: <some_id> testuser2024@gmail.com
```

**If you see all three:** ✅ User is being saved to database!

### **Step 4: Verify OTP**
1. Copy the OTP number from backend terminal (e.g., 123456)
2. Enter it in the OTP input field
3. Click **"Verify OTP"**
4. Watch backend terminal for success message

### **Step 5: Check if You're Redirected**
- Should redirect to **user-dashboard.html** automatically
- Dashboard should load with provider list
- This confirms registration worked!

---

## 🔍 What to Look For

### **Success Scenario:**
```
Backend Terminal Shows:
✅ OTP Generated: 234567
📝 Creating user with data: { name: 'TestUser2024', email: 'testuser2024@gmail.com', phone: '9876543210', password: 'Test@123456', role: 'user' }
✅ User created successfully: 507f1f77bcf86cd799439011 testuser2024@gmail.com
```
→ User is SAVED to database ✅

### **Failure Scenarios:**

**Scenario 1: Missing userData**
```
❌ OTP Verification Error: Registration data not found
```
→ Frontend didn't send user data. Check register.js

**Scenario 2: Password hashing error**
```
❌ Password hashing error: ...
```
→ Bcrypt issue. Try different password.

**Scenario 3: Duplicate email/phone**
```
❌ OTP Verification Error: E11000 duplicate key error
```
→ User already exists. Use new email/phone.

**Scenario 4: No log messages at all**
→ Registration request didn't reach backend. Check:
- Browser Network tab (F12)
- Frontend script tags in register.html
- Backend CORS enabled

---

## 🧪 Advanced Test: Query Database Directly

**If you need to verify data in MongoDB:**

### Option A: Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/tools/compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `lokseva`
4. View collection: `users`
5. See all registered users

### Option B: Using MongoDB CLI (mongosh)
```bash
mongosh
use lokseva
db.users.find().pretty()
db.users.countDocuments()
db.users.findOne({ email: "testuser2024@gmail.com" })
```

### Option C: Use "Database Debugging Guide"
Check the file `Database_Debugging_Guide.md` in project root for more detailed debugging steps.

---

## ✨ Expected Result After Fix

**Before Fix:** User data not saved to database, users couldn't login
**After Fix:** Users save successfully, appear in database, can login

---

## 📊 Test Checklist

- [ ] Backend shows both "✅ MongoDB connected" AND "✅ Server running"
- [ ] Register new user with unique email
- [ ] Backend terminal shows "✅ OTP Generated: XXXXXX"
- [ ] Backend terminal shows "📝 Creating user with data: ..."
- [ ] Backend terminal shows "✅ User created successfully: <id> <email>"
- [ ] Can verify OTP and redirect to dashboard
- [ ] Can login with registered email/password
- [ ] Dashboard loads with provider data

---

## 🎯 Next Actions

1. **Try registering RIGHT NOW** with the fixes applied
2. **Watch backend terminal** for the three success messages
3. **If you see all three messages** → Database is working! ✅
4. **If you see errors** → Copy the error message and share it

**The system is ready - test it now!**

---

## 💡 Pro Tip

Keep terminal logs visible while registering:
- **Terminal 1** (Backend) → Shows registration logs
- **Browser Network Tab** (F12) → Shows API responses  
- **Browser Console** (F12) → Shows JavaScript errors

This gives you full visibility into what's happening!
