# Pages Directory

This directory contains all the main page components for the iReadCustomer admin dashboard.

## Pages

- `Login.tsx` - Login page with Google authentication and email/password fallback
- `Dashboard.tsx` - Main dashboard with overview stats and recent activity
- `NewsManagement.tsx` - News content management interface
- `VerificationQueue.tsx` - Content verification workflow
- `WorkflowDashboard.tsx` - n8n workflow management with weekly categories config
- `CategoriesManagement.tsx` - Category management interface
- `Profile.tsx` - User profile and settings page
- `NewsDetail.tsx` - Detailed view for individual news articles

## Features

- Google OAuth integration in Login page
- Responsive design with iReadCustomer branding
- Navigation between pages handled by App.tsx
- Clean separation from reusable components in `/components/`