# SkyFox Cinema Frontend

## Overview

SkyFox Cinema Frontend is a modern, responsive web application built with **Next.js 13+** (App Router) and **Chakra UI**. The frontend provides a seamless user experience for booking movie tickets, managing profiles, and handling authentication securely.

The application implements a clean, modular architecture with proper separation of concerns, reusable components, and consistent error handling. It communicates with the [SkyFox Backend](https://github.com/iamsuteerth/skyfox-backend) to provide a complete movie booking experience.

## Features

- JWT-based authentication with secure cookie storage
- Role-based access control **(customer, staff, admin)**
- Multi-step password recovery flow with security questions
- Secure profile image management via API proxy
- Responsive design that works across all device sizes
- Component-based architecture for maintainability
- Centralized error handling with consistent user feedback
- Server-side metadata generation
- Theme customization with Chakra UI

## Environment Configuration

The application requires the following environment variables:

```
# API Configuration
API_BASE_URL=
API_KEY=

# Environment Mode
NODE_ENV=development
```

The `API_BASE_URL` variable points to the SkyFox Backend API endpoint and is used throughout the application to construct API request URLs. This is server sided and all the backend calls are proxied from the client never exposing the actual URLs.

The `API_KEY` variable points to the SkyFox Backend API Key as the backend won't work without providing it.

The `NODE_ENV` variable determines which features are available. In development mode (`NODE_ENV=development`), additional developer tools and preview pages are accessible.

> **Developer Note:** When running in development mode, you can access the theme preview at [http://localhost:3000/theme-preview](http://localhost:3000/theme-preview) to see all theme components in one place. This page is only available when the application is running in development mode.

## Project Structure

The project follows a well-organized directory structure:

```
src/
├── app/                  # Next.js 13+ App Router pages and layouts
│   ├── api/              # API routes for server-side operations
│   ├── components/       # Shared UI components
│   ├── login/            # Login page
│   ├── forgot-password/  # Password recovery flow
│   └── shows/            # Movie listings
├── constants/            # Application constants
├── contexts/             # React contexts
├── services/             # API service layer
├── theme/                # UI theme configuration
└── utils/                # Utility functions
```

## App Router Architecture

### Directory-Based Routing

The project leverages Next.js 13+ App Router for its routing system:

- **File-based Routing**: Each directory in the `app/` folder represents a route
- **Server Components**: Page components (`page.tsx`) use server-side rendering for metadata
- **Client Components**: Interactive UI elements are marked with `'use client'` directive
- **Nested Layouts**: Common layouts are shared across multiple pages

### Example Structure: Forgot Password Feature

```
app/forgot-password/
├── components/
│   ├── email-step.tsx         # Email input step
│   ├── security-step.tsx      # Security question step
│   ├── reset-step.tsx         # Password reset step
│   ├── forgot-password.tsx    # Main component
│   └── forgot-password-stepper.tsx  # Stepper UI
└── page.tsx                   # Server component with metadata
```

## API Proxy Architecture

### Secure Backend Communication

The SkyFox Frontend implements a sophisticated API proxy architecture that enhances security and maintainability:

- **Environment Variable Abstraction**: Backend API URL and API Key are stored in server-side environment variables (`API_BASE_URL` and `API_KEY`), ensuring these sensitive details are never exposed to clients
- **Next.js API Route Proxying**: All client-side requests are routed through Next.js API routes that act as secure proxies to the backend
- **Transparent Authentication Forwarding**: Authentication tokens are securely passed between the client and backend through the proxy layer

### Implementation Structure

The proxy architecture is organized in a clean, hierarchical structure:

```
app/api/
├── customer/
│   ├── profile-image/
│   │   └── route.ts       # Profile image data endpoint
│   └── signup/
│       └── route.ts       # Customer registration endpoint
├── forgot-password/
│   └── route.ts           # Password recovery endpoint
├── login/
│   └── route.ts           # Authentication endpoint
├── profile-image/
│   └── route.ts           # Profile image proxy with binary data handling
├── security-questions/
│   ├── by-email/
│   │   └── route.ts       # Security questions by email endpoint
│   └── route.ts           # General security questions endpoint
├── shows/
│   └── route.ts           # Movie shows data endpoint
└── verify-security-answer/
    └── route.ts           # Security answer verification endpoint
```

### Key Benefits

This proxy architecture offers several significant advantages:

1. **Enhanced Security**: Sensitive backend URLs and API keys remain server-side
2. **Consistent Error Handling**: Standardized error processing across all API interactions
3. **Simplified Client Code**: Frontend components interact with relative URLs
4. **Centralized Request Processing**: Common request headers and authentication logic in one place
5. **Flexible Backend Migration**: Backend API changes only require updates to proxy endpoints

### Profile Image Proxy Example

The profile image system showcases the elegance of this approach:

- **Two-Layer Proxy**: Client requests profile image from `/api/profile-image`
- **Server-Side Resolution**: The proxy fetches the presigned URL from `/api/customer/profile-image`
- **Secure Image Retrieval**: Next.js server fetches the image using the presigned URL
- **Client Receives Image**: Raw image data is returned to client without exposing the presigned URL
- **Caching Implementation**: Proper HTTP cache headers ensure optimal performance

```
Client                    Next.js API Routes                  Backend API
  │                              │                                │
  │ GET /api/profile-image       │                                │
  │ -------------------------->  │                                │
  │                              │ GET /api/customer/profile-image│
  │                              │ ------------------------------>│
  │                              │                                │
  │                              │ PresignedURL                   │
  │                              │                                │
  │                              │                                │
  │                              │ Image Data                     │
  │                              │ <------------------------------│
  │                              │                                │
  │ Image Data                   │                                │
  │ <--------------------------- │                                │
  │                              │                                │
```

### Client-Side Integration

The service layer seamlessly integrates with this proxy architecture:

- **Abstracted Endpoints**: Frontend services use relative URLs defined in `API_ROUTES` constants
- **Type Safety**: Full TypeScript integration ensures proper request and response typing
- **Transparent Proxying**: Components are unaware they're communicating through a proxy

This elegant approach allows the frontend to maintain clean separation of concerns while ensuring secure communication with the backend. It also simplifies future changes to the backend infrastructure, as only the proxy layer would need to be updated rather than modifying client-side code throughout the application.

## Authentication System

### JWT Authentication

Authentication is implemented using JSON Web Tokens (JWT) with several security features:

- **Secure Cookie Storage**: JWTs are stored in cookies with appropriate security settings
- **Token Validation**: Tokens are checked for validity and expiration on each request
- **User Data Extraction**: User details are extracted directly from the token
- **Global Auth State**: A central context provides authentication data to all components

### Protected Routes

The application implements route protection that:

- Checks the user's authentication status
- Redirects unauthenticated users to the login page
- Verifies user roles against allowed roles for each route
- Handles loading states appropriately
- Provides clear error messages for unauthorized access attempts

## Service Layer

### API Communication Abstraction

The service layer separates API communication from UI components:

- **Endpoint Constants**: All API endpoints are defined in the constants file
- **Type-Safe Services**: Each API endpoint has a dedicated function with TypeScript interfaces
- **Standard Error Handling**: Consistent approach to processing API errors
- **Response Processing**: Standardized handling of API responses

### Error Processing

All API responses follow a standard pattern:

1. Check for successful response status
2. Parse and validate response data
3. Handle error states with descriptive messages
4. Return strongly-typed responses to components

## Theme Implementation

### Chakra UI Integration

The application uses a custom Chakra UI theme that provides:

- **Brand Colors**: Primary (#E04B00), secondary, and accent colors
- **Component Variants**: Custom styling for buttons, inputs, and other components
- **Typography System**: Custom fonts with responsive sizing
- **Responsive Breakpoints**: Consistent device size handling

### Custom Components

The theme extends Chakra UI with custom components like:

- **NeumorphicCard**: Cards with soft shadow effects
- **FormInput**: Enhanced form elements with validation states
- **Custom Buttons**: Application-specific button variants

## Component Architecture

### Reusable Base Components

The project includes several reusable components:

- **FormInput**: Enhanced input field with validation
- **BrandLogo**: Consistent logo display with optional tagline
- **NeumorphicCard**: Card with neumorphic design for content containers
- **PageContainer**: Layout wrapper for consistent page structure

### Multi-Step Forms

Complex workflows like password recovery are implemented with:

- **Step Management**: Proper state tracking between steps
- **Data Persistence**: Form data maintained throughout the workflow
- **Visual Feedback**: Clear indication of current step and progress
- **Error Isolation**: Each step handles its own errors

## Profile Image Proxy

### Secure Image Handling

The profile image system uses a Next.js API route as a proxy:

- **Client-Side Component**: Displays images with loading and error states
- **Server-Side Processing**: Securely fetches images from S3 via backend
- **Caching Strategy**: Implementation of proper cache headers (24 hours)
- **Refresh Mechanism**: Support for manual image refreshing when needed

### Benefits

1. **Enhanced Security**: S3 URLs are never exposed to the client
2. **Performance Optimization**: Proper caching reduces backend load
3. **User Privacy**: Direct image URLs can't be shared or accessed without authentication
4. **Seamless Updates**: Profile image changes are reflected with minimal delay

## Error Handling

### Centralized Error Processing

The application uses a comprehensive error handling system:

- **Error Utility**: Transforms API errors into user-friendly messages
- **Error Constants**: Predefined messages for common error scenarios
- **Contextual Display**: Errors shown in appropriate UI locations (forms, toasts)
- **Network Error Handling**: Graceful handling of connectivity issues

### Error Response Structure

Error responses follow a consistent format, handling:

- API-specific error codes (e.g., `INVALID_CREDENTIALS`, `USER_NOT_FOUND`)
- HTTP status codes (400, 401, 403, etc.)
- Network and connectivity errors
- Validation errors with field-specific messages

## Frontend Validation

### Client-Side Input Validation

The application implements comprehensive validation:

- **Form-Level Validation**: Prevents submission of invalid data
- **Field-Level Validation**: Real-time feedback on input errors
- **Custom Validators**: Email, password strength, and other specific validations
- **Error Messages**: Clear, user-friendly validation error messages

## Backend Integration

### API Contract Alignment

The frontend strictly follows the [SkyFox Backend](https://github.com/iamsuteerth/skyfox-backend) API contract:

- **Request Formatting**: Properly structured API requests
- **Response Handling**: Correct processing of all response types
- **Error Code Handling**: Mapping of backend error codes to frontend messages
- **Validation Rules**: Frontend validation matches backend requirements

## Responsive Design

### Adaptive User Interface

The application provides a seamless experience across devices through:

- **Responsive Layouts**: Fluid designs that adapt to screen sizes
- **Mobile-First Approach**: Optimized for mobile with progressive enhancement
- **Breakpoint System**: Consistent handling of different device sizes
- **Touch-Friendly Interactions**: Optimized for both mouse and touch input