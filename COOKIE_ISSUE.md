# Cookie Authentication Issue - Backend Configuration Needed

## 🔴 Problem

After successful Google OAuth login, the user is redirected back to the frontend but **authentication cookies are not being sent/received**, causing continuous 401 errors.

## 🔍 Current Flow

1. ✅ User clicks "Continue with Google" → Frontend redirects to `https://d2snwaeegxbt9.cloudfront.net/auth/google`
2. ✅ Backend redirects to Google OAuth
3. ✅ User logs in with Google
4. ✅ Google redirects back to backend with auth code
5. ⚠️ **Backend processes OAuth BUT cookies not working**
6. ❌ Backend redirects to frontend `http://localhost:3000` or `https://irc-ai-automation.vercel.app`
7. ❌ Frontend calls `/user/profile` → 401 Unauthorized (no cookies sent)

## 🐛 Root Cause

**Cross-domain cookie issue**:
- Backend domain: `d2snwaeegxbt9.cloudfront.net`
- Frontend domains: `localhost:3000` (dev) and `irc-ai-automation.vercel.app` (prod)
- Cookies set by backend are not being sent back by browser due to domain mismatch

## ✅ Solution: Backend Must Configure SameSite Cookies

### Required Backend Changes

The backend needs to set cookies with these attributes:

```javascript
// When setting authentication cookies
res.cookie('session_token', token, {
  httpOnly: true,           // Security: prevent JavaScript access
  secure: true,             // HTTPS only (required for SameSite=None)
  sameSite: 'None',         // CRITICAL: Allow cross-site cookies
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',                // Available for all routes
  domain: '.cloudfront.net' // Or don't set domain for strictness
});
```

### CORS Headers Also Required

```javascript
// Backend CORS configuration
app.use(cors({
  origin: [
    'https://irc-ai-automation.vercel.app',  // Production
    'http://localhost:3000',                  // Development
  ],
  credentials: true,  // CRITICAL: Must be true for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// For all responses
res.header('Access-Control-Allow-Credentials', 'true');
```

### After OAuth Success, Backend Should:

1. **Set session cookie** with `SameSite=None; Secure`
2. **Redirect to frontend** with success indicator
3. **Ensure CORS headers** include `Access-Control-Allow-Credentials: true`

## 🔬 How to Debug

### Backend Developer Should Check:

1. **Are cookies being set?**
   - Check response headers for `Set-Cookie`
   - Verify `SameSite=None` and `Secure` flags are present

2. **Are CORS headers correct?**
   ```
   Access-Control-Allow-Origin: http://localhost:3000
   Access-Control-Allow-Credentials: true
   ```

3. **Is the redirect URL correct?**
   - After OAuth: Should redirect to `http://localhost:3000` (dev) or `https://irc-ai-automation.vercel.app` (prod)
   - Optionally with query param like `?auth=success`

### Frontend Developer Can Check:

1. **Open browser DevTools** → Network tab
2. **Click "Continue with Google"**
3. **Watch the redirect chain**:
   - Frontend → Backend `/auth/google`
   - Backend → Google OAuth
   - Google → Backend callback
   - **Backend → Frontend** (check response headers here!)
4. **Look for `Set-Cookie` header** in the backend redirect response
5. **Check Application tab** → Cookies → Should see session cookie

## 📋 Quick Test Commands

### Check if cookies are being set:
```bash
curl -v -X GET https://d2snwaeegxbt9.cloudfront.net/user/profile \
  -H "Cookie: session_token=YOUR_TOKEN_HERE" \
  --cookie-jar cookies.txt
```

### Check CORS:
```bash
curl -v -X OPTIONS https://d2snwaeegxbt9.cloudfront.net/user/profile \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## 🎯 Expected Behavior After Fix

1. User clicks "Continue with Google"
2. Completes OAuth flow
3. Backend sets cookie with `SameSite=None; Secure`
4. Backend redirects to frontend
5. Frontend makes `/user/profile` request with `credentials: 'include'`
6. Browser automatically sends cookie
7. Backend returns 200 OK with user data
8. Dashboard appears ✅

## 📝 Alternative Solutions

If cross-domain cookies are problematic, consider:

1. **Token in URL** (less secure):
   - Redirect to `http://localhost:3000?token=JWT_TOKEN`
   - Frontend stores in localStorage
   - Send as `Authorization: Bearer TOKEN` header

2. **Same-domain deployment**:
   - Host frontend and backend on same domain
   - Example: `app.yourdomain.com` (frontend) and `api.yourdomain.com` (backend)
   - Cookies work naturally within same domain

3. **Backend sets token in localStorage via postMessage**:
   - Open popup window for OAuth
   - Backend sends token to opener window
   - Frontend stores in localStorage

## 🔗 Resources

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Chrome SameSite Updates](https://web.dev/samesite-cookies-explained/)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)

