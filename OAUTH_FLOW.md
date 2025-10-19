# OAuth Authentication Flow

This document describes the Google OAuth authentication flow implemented in the iReadCustomer Admin Dashboard.

## Flow Overview

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐     ┌─────────────┐
│   User      │────▶│   Backend    │────▶│   Google   │────▶│   Backend   │
│  (Browser)  │◀────│   (AWS)      │◀────│   OAuth    │◀────│   (AWS)     │
│             │     │              │     └────────────┘     │             │
│             │◀────┤  Sets Cookie │                        │  Validates  │
└─────────────┘     └──────────────┘                        └─────────────┘
```

## Step-by-Step Process

### 1. **User Initiates Login**
- User clicks "Continue with Google" button on login page (`/`)
- Browser redirects to: `${BACKEND_URL}/auth/google`
- **Note:** No frontend loading state to avoid redirect loops

### 2. **Backend Redirects to Google**
- Backend receives the request
- Backend redirects user to Google OAuth consent screen
- User sees Google account selection

### 3. **User Selects/Authorizes Account**
- User selects their Google account
- User grants requested permissions
- Google redirects back to backend with authorization code

### 4. **Backend Processes Authorization**
- Backend receives authorization code from Google
- Backend exchanges code for access token with Google
- Backend validates the user's account
- Backend creates session and sets authentication cookie
- Backend redirects to: `${FRONTEND_URL}/` (root page)

### 5. **Frontend Checks Authentication**
- Frontend loads and checks authentication via `GET ${BACKEND_URL}/user/profile`
- Request includes cookies automatically (`credentials: 'include'`)
- **If Valid Account:** Shows dashboard
- **If Invalid Account:** Shows login page with error

### 6. **Authentication Result**

**If Valid Account:**
- Backend set authentication cookie
- Frontend detects valid session
- User sees dashboard immediately

**If Invalid Account:**
- Backend redirects with `?error=invalid_account` query parameter
- Frontend shows error message on login page
- User can try again with different account

## Files Involved

### Frontend
- **`src/views/Login.tsx`** - Login page with Google button (redirects to backend)
- **`src/app/page.tsx`** - Main page with auth state management
- **`src/config/api.ts`** - API endpoints configuration

### Backend Endpoints
- **`GET /auth/google`** - Initiates OAuth flow and handles complete OAuth process
- **`GET /user/profile`** - Validates user session (returns user data if authenticated)
- **`POST /auth/logout`** - Logs out user and clears session cookies

## Session Management

### Storage
- Backend sets HTTP-only session cookies after successful authentication
- Frontend does NOT store tokens - backend manages sessions via cookies
- Cookies are sent automatically with every request using `credentials: 'include'`

### Validation
- On page load, frontend checks authentication by calling `/user/profile`
- If response is 200 OK → User is authenticated → Show dashboard
- If response is 401/403 → User is not authenticated → Show login page
- Cookies are automatically included in the request

### Logout
- User clicks logout button
- Frontend calls `POST /auth/logout` endpoint with `credentials: 'include'`
- Backend clears session cookies
- Frontend redirects to `/` to force re-authentication

## Error Handling

### Common Errors
- **`access_denied`** - User denied OAuth permission
- **`no_code`** - No authorization code received from Google
- **`invalid_account`** - User account not authorized
- **Custom errors** - Displayed as-is from backend

### Error Display
- Errors are shown in red alert box on login page
- URL is cleaned up after error is displayed
- User can retry authentication

## Environment Variables

### Required
- **`NEXT_PUBLIC_BACKEND_URL`** - Backend API URL (defaults to AWS Elastic Beanstalk)
- **`NEXT_PUBLIC_DEMO`** - Set to `'true'` to bypass authentication (development only)

## Security Considerations

1. **HTTPS Required** - OAuth requires secure connections
2. **Token Expiration** - Backend should implement token expiration
3. **CORS Configuration** - Backend must allow frontend origin
4. **Credential Validation** - Backend must validate Google tokens
5. **Account Authorization** - Backend must check if user is authorized

## Testing

### Local Development
1. Set `NEXT_PUBLIC_BACKEND_URL` to your backend URL
2. Ensure backend is running and accessible
3. Test OAuth flow end-to-end
4. Check browser console and network tab for errors

### Demo Mode
1. Set `NEXT_PUBLIC_DEMO=true` in `.env.local`
2. Authentication is bypassed
3. Dashboard is immediately accessible

## Troubleshooting

### "Login redirects to old backend"
- Clear browser cache and hard refresh (`Cmd+Shift+R`)
- Check `.env.local` for correct `NEXT_PUBLIC_BACKEND_URL`
- Verify build output contains correct URL

### "Invalid account error"
- Ensure your Google account is authorized in backend
- Check backend logs for validation errors
- Verify `/user/profile` endpoint is working

### "Authentication failed"
- Check network tab for failed requests
- Verify backend `/auth/google` endpoint is accessible
- Ensure Google OAuth credentials are configured correctly

