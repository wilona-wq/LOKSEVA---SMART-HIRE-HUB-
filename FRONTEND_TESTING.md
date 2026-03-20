# 🧪 Frontend Testing Checklist

## ✅ Current System Status

```
✅ Backend:    http://localhost:3000     (Running)
✅ Frontend:   http://localhost:8080     (Running)
✅ MongoDB:    Connected to 'lokseva'    (Ready)
✅ API Config: Correct - Points to backend
```

---

## 🚀 Quick Test (5 minutes)

### Test 1: Can You Access Frontend?
```
1. Open Browser: http://localhost:8080
2. Should see LOKSEVA landing page
3. Check Console (F12) for errors
✅ If you see landing page: PASS
❌ If blank/error: Check network, refresh (Ctrl+Shift+R)
```

### Test 2: Register Page Loads
```
1. Click "Register" button on page
2. Should see role selection (USER/PROVIDER)
3. Should see form with fields
✅ If form appears: PASS
❌ If blank/error: Check script tags in register.html
```

### Test 3: Backend Connection
```
1. On register page, fill form:
   - Name: Test123
   - Email: test123@gmail.com
   - Phone: 9876543210
   - Password: Test@123456
2. Click "Register as USER"
3. Watch Backend Terminal
✅ If you see "✅ OTP Generated: XXXXXX": PASS
❌ If no message: Backend connection failed (check URL)
```

### Test 4: OTP Verification
```
1. Copy OTP from Backend Terminal
2. Enter in OTP field on page
3. Click "Verify OTP"
4. Watch Backend Terminal
✅ If you see "✅ User created successfully:": PASS
❌ If error message: Check Backend Terminal logs
```

### Test 5: Dashboard Loads
```
1. After OTP verification, should auto-redirect to dashboard
2. Dashboard should show provider list
3. Check Console (F12) for errors
✅ If providers display: PASS
❌ If blank: Check API response in Network tab
```

---

## 📋 Detailed Checklist

### Frontend Files
- [ ] register.html contains both `<script src="api.js">` and `<script src="register.js">`
- [ ] login.html contains both scripts
- [ ] Dashboards contain both scripts
- [ ] api.js has `API_BASE_URL = "http://localhost:3000/api"`

### Form Elements (Check with Inspector - F12)
- [ ] register.html has form fields with correct IDs:
  - `user-name`, `user-email`, `user-phone`, `user-password`, `user-confirm`
  - `provider-name`, `provider-email`, etc.
- [ ] login.html has role buttons and input fields
- [ ] OTP input field exists

### JavaScript Functions
- [ ] api.js loads without errors (check Console)
- [ ] register.js loads without errors
- [ ] login.js loads without errors
- [ ] Can call: `registerUser('user')` from Console
- [ ] Can call: `loginUser('user')` from Console

### API Communication
- [ ] F12 → Network tab shows requests
- [ ] POST /api/auth/register returns status 200
- [ ] POST /api/auth/verify-otp returns status 201
- [ ] Response includes token and user data
- [ ] Token stored in localStorage

### Error Handling
- [ ] Error messages display on page when validation fails
- [ ] Backend errors shown to user
- [ ] No JavaScript errors in Console
- [ ] User gets clear feedback on success/failure

---

## 🔴 Common Issues & Fixes

### Issue: "Cannot connect to server"
**Check:**
1. Backend running? (`npm run dev` in Backend folder)
2. Frontend has correct API URL? (should be `http://localhost:3000/api`)
3. CORS enabled in backend? (it is by default)

**Fix:** Restart backend: `cd Backend && npm run dev`

---

### Issue: "OTP not appearing in terminal"
**Check:**
1. Registration submitting? (watch Network tab)
2. Backend Terminal showing any messages?
3. Any errors in Console (F12)?

**Fix:** Check if post request to `/api/auth/register` succeeded

---

### Issue: Dashboard blank after login
**Check:**
1. Network tab - GET /api/providers returning data?
2. Console - any errors?
3. Browser Network tab - check response status

**Fix:** 
- Hard refresh: Ctrl+Shift+R
- Check Backend Terminal for errors
- Verify MongoDB has providers

---

### Issue: Form not submitting
**Check:**
1. All fields filled? (orange borders = required)
2. Password >= 6 characters?
3. Passwords match?
4. Console shows any JavaScript errors?

**Fix:**
- Fill all required fields
- Check browser Console (F12)
- Verify register.js loaded

---

## 📊 What to Monitor While Testing

### Backend Terminal
```
Watch for these during registration:
✅ OTP Generated: 123456
📝 Creating user with data: {...}
✅ User created successfully: <id> <email>
```

### Browser Console (F12)
```
Good: No red errors
Bad: Red error messages = javascript issue
Debug: Green/blue logs help trace flow
```

### Network Tab (F12)
```
Good: All requests green (200, 201 status)
Bad: Red requests or timeouts
Check: Response preview to see actual data
```

---

## ✨ Success Checklist

After registering and login, you should see:

- [ ] User data in Browser Console: `getStoredUser()`
- [ ] Auth token in localStorage: `localStorage.getItem('authToken')`
- [ ] Dashboard with providers list
- [ ] No errors in Console (F12)
- [ ] Can filter by category
- [ ] Can search providers
- [ ] Can click "View Profile" on provider

---

## 🎯 Test Commands (Console - F12)

Run these in Browser Console (F12 → Console tab) to test:

```javascript
// Check if API loaded
typeof apiCall

// Check current user
getStoredUser()

// Check token
localStorage.getItem('authToken')

// Check API base URL
API_BASE_URL

// Test API call
getAllProviders().then(p => console.log(p))

// Clear auth (logout)
clearAuthData()
```

---

## 🏁 When Everything Works

You should be able to:
1. ✅ Register new user with email/phone
2. ✅ Get OTP from backend terminal
3. ✅ Verify OTP and create account
4. ✅ Auto-redirect to dashboard
5. ✅ See list of providers
6. ✅ Login with registered credentials
7. ✅ View user/provider profiles
8. ✅ Edit profile information
9. ✅ Search and filter providers
10. ✅ Data persists after logout/login

---

## 🚀 Ready to Test

**Frontend:** http://localhost:8080
**Backend:** http://localhost:3000

**Test Now!** Follow Test 1-5 above to verify everything works.

If any test fails, check the corresponding section above for fixes.

---

## 📞 Quick Help

| Issue | Check | Fix |
|-------|-------|-----|
| Page blank | Console (F12) | Hard refresh: Ctrl+Shift+R |
| No OTP | Backend Terminal | Check backend logs |
| Login fails | Network tab | POST /api/auth/login status |
| Dashboard slow | Network tab | Check API response time |
| Data not saving | Backend logs | Check MongoDB connection |

---

**You're all set - the frontend is ready to test!** 🚀
