# ✅ Troubleshooting Guide - Common Errors Fixed

## Error: "Cannot read properties of undefined (reading 'message')"

### ✅ FIXED - What was wrong:
- Function naming conflict in `login.js`
- The `loginUser()` function in login.js was calling itself instead of the API version
- Response was undefined because of this recursion issue

### ✅ FIXED - What we did:
- Rewrote `login.js` to use direct fetch calls instead of relying on the api.js wrapper
- Added proper error handling and response validation
- Fixed function naming to avoid conflicts

---

## Testing Your Fix

### 1. Hard Refresh Browser
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### 2. Test Login
1. Go to http://localhost:3000/login.html
2. Enter test credentials:
   - Email: your-registered@gmail.com
   - Password: your-password
3. Click "Login as User"
4. Should see success message and redirect to dashboard

### 3. If Still Getting Error
Check browser console (F12 → Console tab) for:
- `"Login error:"` messages with details
- `"Unable to connect"` - Backend not running
- `"Invalid response"` - API endpoint issue

### 4. Check Backend is Running
Terminal 1 should show:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:3000
```

---

## What Each Fix Does

### Fix 1: Function Naming
**Before (Broken):**
```javascript
async function loginUser(role) {
  const response = await loginUser(email, password); // ❌ Calls itself!
}
```

**After (Fixed):**
```javascript
async function handleUserLogin(role) {
  const response = await fetch("http://localhost:3000/api/auth/login", ...)
}
```

### Fix 2: Direct API Calls
- Send API request directly with fetch
- Parse response and check for errors
- Store token immediately
- Provide clear error messages

### Fix 3: Error Handling
- Check if response exists before accessing properties
- Log errors to console for debugging
- Show user-friendly error messages
- Fallback messages if main message is missing

---

## Still Having Issues?

### Issue: "Cannot connect to server"
```bash
# Check if backend is running
# Terminal 1 should show: ✅ Server running on http://localhost:3000

# If not, restart backend:
cd Backend
npm run dev
```

### Issue: "Invalid response"  
```
# Check if MongoDB is running
mongod

# Verify .env file has correct MONGODB_URI
cat Backend/.env
```

### Issue: "Email or password wrong"
```
# Make sure you registered first
# Go to http://localhost:3000/register.html

# Check OTP from terminal when registering
# Look for: "✅ OTP Generated: 123456"
```

### Issue: See Error in Console
```
# Open Browser DevTools: F12
# Go to Console tab
# Look for "Login error:" messages
# Note the exact error and check corresponding solution above
```

---

## Quick Verification Checklist

- [ ] Backend running: `npm run dev` in Backend folder
- [ ] MongoDB running: `mongod` in separate terminal
- [ ] Frontend accessible: http://localhost:3000
- [ ] Browser cache cleared: Ctrl+Shift+R
- [ ] test user registered: Go to register.html first
- [ ] No JavaScript errors: Check F12 console
- [ ] API Base URL correct: Should be http://localhost:3000/api

---

## Files Modified

1. **login.js** - Fixed loginUser function naming conflict
2. **register.js** - No changes needed (already working)
3. **api.js** - No changes needed (already working)

All fixes maintain backward compatibility with existing HTML on click handlers.

---

**Next Steps:**
1. Refresh browser
2. Test login with registered account
3. Check console for any remaining errors
4. Report specific error message if still failing

