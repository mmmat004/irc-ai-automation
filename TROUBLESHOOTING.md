# 401 Unauthorized Error - Troubleshooting Guide

## Problem Overview

When running your Next.js app locally, you're seeing:
```
GET https://d2snwaeegxbt9.cloudfront.net/user/profile 401 (Unauthorized)
```

This happens because your app uses **cookie-based authentication** with a CloudFront backend, and browsers block cross-origin cookies between:
- **Local dev server**: `http://localhost:3000` 
- **Backend API**: `https://d2snwaeegxbt9.cloudfront.net`

---

## Quick Solutions

### ✅ Solution 1: Enable Demo Mode (Recommended for Local Dev)

**Best for**: Development without needing real authentication

1. **Create `.env.local`** in your project root:
```bash
NEXT_PUBLIC_DEMO=true
```

2. **Restart your dev server**:
```bash
pnpm dev
```

This bypasses authentication entirely for local development.

---

### ✅ Solution 2: Use Local Backend Proxy

**Best for**: Testing with real backend while avoiding CORS

Add this to your `next.config.js`:

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://d2snwaeegxbt9.cloudfront.net/:path*',
      },
    ];
  },
};
```

Then update `src/config/api.ts`:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';
```

This proxies API requests through your Next.js server, avoiding cross-origin issues.

---

### ✅ Solution 3: Configure Backend CORS (Backend Team)

**Best for**: Production-ready setup

Your backend needs to send these headers for `localhost`:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**CloudFront Configuration:**
1. Go to CloudFront distribution settings
2. Under "Behaviors" → Edit the behavior
3. Under "Cache Key and Origin Requests":
   - Choose "Legacy cache settings"
   - Add `Authorization` to allowed headers
   - Enable "CORS-CustomOrigin" for Origin Request Policy
4. Configure backend cookies:
   ```
   SameSite=None; Secure; HttpOnly
   ```

---

## What Changed

I've improved error handling in your code to show clear messages:

### Files Updated:
- ✅ `src/app/page.tsx` - Better auth error messages
- ✅ `src/App.tsx` - Enhanced error logging and React import fix
- ✅ `src/views/Profile.tsx` - Clearer 401 error handling

### New Features:
- Console warnings when authentication fails
- User-friendly error messages displayed in UI
- Better distinction between network errors vs. auth errors

---

## How to Test

### Using Demo Mode:
1. Create `.env.local` with `NEXT_PUBLIC_DEMO=true`
2. Run `pnpm dev`
3. Navigate to `http://localhost:3000`
4. Should see dashboard immediately (no login required)

### With Real Backend:
1. Check browser DevTools → Console for detailed error messages
2. Check DevTools → Application → Cookies to see if auth cookies exist
3. Check DevTools → Network → Select the failed request → Check:
   - **Request Headers**: Does it have `Cookie:` header?
   - **Response Headers**: Are CORS headers present?

---

## Understanding the Error

### Why This Happens:

1. **Cross-Origin Cookie Blocking**:
   - Your app: `http://localhost:3000` (different origin)
   - Backend: `https://d2snwaeegxbt9.cloudfront.net`
   - Browsers block cookies between different origins by default

2. **SameSite Cookie Policy**:
   - Modern browsers enforce `SameSite=Lax` by default
   - This prevents cookies from being sent in cross-site requests
   - Backend needs to explicitly set `SameSite=None; Secure`

3. **CORS Preflight**:
   - Browser sends OPTIONS request first
   - Backend must allow credentials from your origin
   - CloudFront might strip authentication headers

### Authentication Flow (When Working):

```
1. User clicks "Login with Google"
   → Redirects to: https://d2snwaeegxbt9.cloudfront.net/auth/google

2. Google OAuth completes
   → Backend sets authentication cookie
   → Redirects back to your app

3. App checks authentication
   → GET /user/profile with credentials: 'include'
   → Cookie automatically sent with request
   → 200 OK = authenticated ✅
   → 401 Unauthorized = not authenticated ❌
```

---

## Additional Debugging

### Check Browser Console:
```javascript
// Check if cookies exist
document.cookie

// Test API call manually
fetch('https://d2snwaeegxbt9.cloudfront.net/user/profile', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

### Check Network Tab:
1. Open DevTools → Network
2. Find the failed `/user/profile` request
3. Check:
   - **Request Headers**: Look for `Cookie` header
   - **Response Headers**: Look for `Access-Control-*` headers
   - **Status**: 401 means no valid auth, CORS error means blocked by browser

---

## Environment Variables Reference

Create `.env.local` with any of these:

```bash
# Enable demo mode (bypass auth)
NEXT_PUBLIC_DEMO=true

# Override backend URL (if using proxy or different backend)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Or keep default CloudFront
# NEXT_PUBLIC_BACKEND_URL=https://d2snwaeegxbt9.cloudfront.net
```

---

## Need More Help?

1. **Check browser console** for detailed error messages (now improved!)
2. **Check Network tab** to see actual HTTP requests/responses
3. **Try demo mode** to verify app works without backend
4. **Contact backend team** if CORS headers are missing

---

## Summary

**Quick Fix**: Use demo mode with `.env.local`:
```bash
NEXT_PUBLIC_DEMO=true
```

**Proper Fix**: Configure backend CORS to allow `localhost:3000` with credentials, or use Next.js proxy.

The code improvements I made will now show you clear error messages explaining exactly what's wrong! 🎉

