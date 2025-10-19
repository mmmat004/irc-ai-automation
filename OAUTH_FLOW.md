# OAuth Authentication Flow

This document describes the Google OAuth authentication flow implemented in the iReadCustomer Admin Dashboard.

## Flow Overview

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐     ┌─────────────┐
│   User      │────▶│   Frontend   │────▶│   Google   │────▶│   Backend   │
│  (Browser)  │◀────│   (Next.js)  │◀────│   OAuth    │◀────│   (AWS)     │
└─────────────┘     └──────────────┘     └────────────┘     └─────────────┘
```

## Step-by-Step Process

### 1. **User Initiates Login**
- User clicks "Continue with Google" button on login page (`/`)
- Frontend shows loading spinner
- Browser redirects to: `${BACKEND_URL}/auth/google`

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
- Backend exchanges code for access token
- Backend validates the user's account
- Backend redirects to: `${FRONTEND_URL}/auth/callback?code=...`

### 5. **Frontend Callback Handler**
- Frontend callback page (`/auth/callback`) receives the code
- Frontend exchanges code for JWT token via `POST ${BACKEND_URL}/auth/oauth-exchange-token`
- Frontend validates user account via `GET ${BACKEND_URL}/user/profile`

### 6. **Authentication Result**

**If Valid Account:**
- Frontend stores JWT token in `localStorage`
- Frontend redirects to `/?authenticated=true`
- Main page detects authentication and shows dashboard

**If Invalid Account:**
- Frontend redirects to `/?error=Invalid account. Please use an authorized account.`
- Login page shows error message
- User can try again with different account

## Files Involved

### Frontend
- **`src/views/Login.tsx`** - Login page with Google button
- **`src/app/page.tsx`** - Main page with auth state management
- **`src/app/auth/callback/page.tsx`** - OAuth callback handler
- **`src/config/api.ts`** - API endpoints configuration

### Backend Endpoints
- **`GET /auth/google`** - Initiates OAuth flow
- **`POST /auth/oauth-exchange-token`** - Exchanges code for JWT
- **`GET /user/profile`** - Validates user account
- **`POST /auth/logout`** - Logs out user

## Token Management

### Storage
- JWT tokens are stored in browser's `localStorage` under key `auth_token`
- Tokens are also sent as HTTP-only cookies for added security

### Validation
- On page load, frontend checks for existing token
- If token exists, frontend validates it via `/user/profile` endpoint
- Invalid tokens are automatically removed

### Logout
- User clicks logout button
- Frontend calls `/auth/logout` endpoint
- Frontend removes token from `localStorage`
- User is redirected to login page

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

