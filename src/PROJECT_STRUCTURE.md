# iReadCustomer Project Structure

## Overview
Modern admin dashboard for news automation system with clean separation between pages and components.

## Directory Structure

```
├── pages/                    # Main page components
│   ├── Login.tsx            # Google OAuth + email/password login
│   ├── Dashboard.tsx        # Overview dashboard
│   ├── NewsManagement.tsx   # News content management
│   ├── VerificationQueue.tsx # Content verification
│   ├── WorkflowDashboard.tsx # n8n workflow management
│   ├── CategoriesManagement.tsx # Category management
│   ├── Profile.tsx          # User settings
│   └── NewsDetail.tsx       # Article detail view
│
├── components/              # Reusable UI components
│   ├── ui/                  # ShadCN UI components
│   ├── figma/              # Figma-specific components
│   └── [various].tsx       # Dashboard-specific components
│
├── styles/
│   └── globals.css         # Tailwind v4 + Plus Jakarta Sans
│
├── app/                    # Next.js 14 app directory
└── App.tsx                 # Main application component
```

## Key Features

- **Google OAuth Integration**: Primary login method with email/password fallback
- **Responsive Design**: Mobile-first with cream/orange branding (#FF7500, #FFF1E6)
- **Clean Architecture**: Pages separated from reusable components
- **AI Content Management**: News articles generated and processed by AI
- **Workflow Automation**: n8n integration with weekly category configuration

## Design System

- **Primary Color**: #FF7500 (Orange)
- **Secondary Color**: #FFF1E6 (Cream)
- **Typography**: Plus Jakarta Sans
- **Layout**: 256px sidebar with card-based content areas