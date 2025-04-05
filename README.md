# SkyFox Cinema Frontend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Theme System](#theme-system)
4. [Core Components](#core-components)
5. [Authentication](#authentication)
6. [Navigation and Routing](#navigation-and-routing)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Project Overview

SkyFox Cinema is a movie booking platform built with Next.js 13+ App Router and Chakra UI. The application follows a modular component architecture with a custom theme system, authentication flow, and reusable UI components.

## Project Structure

```
skyfox-frontend/
├── public/                  # Static assets
│   ├── assets/              # Images and other media
│   │   └── logo.png         # App logo
│   └── globe.svg            # Icon used in the UI
├── src/
│   ├── app/                 # Next.js App Router structure
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/        # Authentication components
│   │   │   │   └── protected-route.tsx  # Route protection wrapper
│   │   │   ├── brand-logo.tsx          # Logo component
│   │   │   ├── form-input.tsx          # Input field component
│   │   │   ├── header.tsx              # App header
│   │   │   ├── neumorphic-card.tsx     # Card with neumorphic design
│   │   │   ├── page-container.tsx      # Page layout wrapper
│   │   │   └── ui/                     # UI utilities
│   │   │       ├── chakra-color-mode-script.tsx  # Theme script
│   │   │       └── custom-toast.tsx    # Toast notifications
│   │   ├── login/                      # Login page
│   │   │   ├── components/
│   │   │   │   └── login.tsx           # Login form component
│   │   │   └── page.tsx                # Login page
│   │   ├── not-found.tsx               # 404 page
│   │   ├── page.tsx                    # Home page
│   │   ├── providers.tsx               # App providers
│   │   └── shows/                      # Shows page
│   │       └── page.tsx                # Shows listing
│   ├── constants/                      # App constants
│   │   └── index.ts                    # Routes, messages, etc.
│   ├── contexts/                       # React contexts
│   │   └── auth-context.tsx            # Authentication context
│   ├── services/                       # API services
│   │   └── auth-service.ts             # Authentication API calls
│   ├── theme/                          # Theme configuration
│   │   └── index.ts                    # Chakra UI theme
│   └── utils/                          # Utility functions
│       ├── date-utils.ts               # Date formatting helpers
│       ├── error-utils.ts              # Error handling
│       ├── fonts.tsx                   # Font configuration
│       └── jwt-utils.ts                # JWT token handling
```

## Theme System

The theme is built on Chakra UI's theming system and configured in `src/theme/index.ts`.

### Color Palette

```typescript
const colors = {
  brand: {
    50: "#FFEEE5",
    // ... other brand colors
    900: "#331100"
  },
  primary: "#E04B00",
  secondary: "#FFB199",
  success: "#228B22",
  error: "#D42158",
  info: "#6495ED",
  tertiary: "#CBA891",
  background: {
    primary: "#FFFFFF",
    secondary: "#F0F0F5"
  },
  surface: {
    light: "#D8DADC",
    dark: "#5C6063"
  },
  text: {
    primary: "#161A1E",
    secondary: "#404348",
    tertiary: "#666A6D",
    quaternary: "#8E9091"
  }
};
```

### Component Styling

The theme defines styles for common components:

- Buttons (solid, outline, ghost, secondary, etc.)
- Inputs 
- Headings
- Text (with variants)
- Switch
- Badge

### Usage

The theme is applied through the `Providers` component in `src/app/providers.tsx`:

```tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme/index';
import { AuthProvider } from '@/contexts/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    
      {children}
    
  );
}
```

## Core Components

### BrandLogo

A reusable component for displaying the SkyFox logo with customizable size and tagline.

**Props:**
- `showTagline`: Whether to show the tagline (default: true)
- `tagline`: The text to display as tagline (default: "Sign in to your account")
- `size`: Size of the logo - 'sm' | 'md' | 'lg' (default: 'md')

**Example:**
```tsx

```

### FormInput

A standardized form input component that handles validation and various input types.

**Props:**
- `label`: Input label
- `value`: Input value
- `onChange`: Change handler function
- `error`: Error message (optional)
- `placeholder`: Input placeholder (optional)
- `type`: Input type (default: 'text')
- `rightElement`: Element to display on the right side (optional)
- `isPassword`: Whether input is a password field (optional)

**Example:**
```tsx
 setUsername(e.target.value)}
  placeholder="Enter your username"
  error={usernameError}
/>
```

### NeumorphicCard

A card component with neumorphic design aesthetics.

**Props:**
- `children`: Card content
- `padding`: Padding for the card (default: { base: 6, md: 10 })
- ...other CardProps from Chakra UI

**Example:**
```tsx

  
    Card Title
    Card content goes here.
  

```

### PageContainer

A layout wrapper for consistent page structure.

**Props:**
- `children`: Page content
- `containerProps`: Props for the Container component (optional)
- `flexProps`: Props for the Flex component (optional)
- `boxProps`: Props for the Box component (optional)

**Example:**
```tsx

  
    Page Content
  

```

### CustomToast

A toast notification system with consistent styling.

**Usage:**
```tsx
const { showToast } = useCustomToast();

showToast({
  type: 'success',
  title: 'Success',
  description: 'Operation completed successfully'
});
```

## Authentication

Authentication is handled through the AuthContext which manages user state, login, logout and token handling.

### JWT Token Handling

JWT tokens are stored in cookies using js-cookie library and validated using utility functions in `src/utils/jwt-utils.ts`:

- `getUserFromToken`: Extracts user data from JWT
- `isTokenExpired`: Checks if token is expired
- `setTokenCookie`: Sets token in cookies
- `removeTokenCookie`: Removes token from cookies

### Auth Context

The `AuthProvider` in `src/contexts/auth-context.tsx` handles:

1. Checking for existing authentication on load
2. Login functionality
3. Logout functionality
4. User state management
5. Error handling

**Example usage:**
```tsx
const { user, login, logout, isLoading, error } = useAuth();

// Login
await login(username, password);

// Logout
logout();

// Check auth state
if (user) {
  // User is authenticated
}
```

### Protected Routes

Routes can be protected using the `ProtectedRoute` component:

```tsx

  

```

This component:
1. Checks if user is authenticated
2. Redirects to login page if not authenticated
3. Checks user role against allowedRoles
4. Displays error toast and redirects if unauthorized
5. Renders children if authorized

## Navigation and Routing

### Route Constants

Routes are defined in `src/constants/index.ts`:

```typescript
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  SHOWS: '/shows',
  // other routes
};
```

### Page Redirects

Redirects are handled in several ways:

1. **Auth-based redirects**: 
   - Unauthenticated users are redirected to login
   - Authenticated users are redirected to shows page from login

2. **Not Found (404) page**:
   - Shows a 404 message with countdown for authenticated users
   - Shows a 404 message with login button for unauthenticated users

### Home Page Redirect

The home page (`src/app/page.tsx`) automatically redirects:
- Authenticated users to Shows page
- Unauthenticated users to Login page

## Error Handling

### Toast Notifications

Errors are displayed using the custom toast system:

```tsx
showToast({
  type: 'error',
  title: 'Error',
  description: errorMessage
});
```

### Form Validation

Form inputs have built-in validation with error messages:

```tsx
 setUsername(e.target.value)}
  error={usernameError}
/>
```

### API Error Handling

API errors are caught and displayed with appropriate messages:

```typescript
try {
  // API call
} catch (err) {
  if (err.statusCode === 400) {
    setError(ERROR_MESSAGES.INVALID_REQUEST);
  } else if (err.statusCode === 401) {
    setError(err.message);
  } else if (err.isNetworkError) {
    setError(ERROR_MESSAGES.NETWORK_ERROR);
  } else {
    setError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
  }
}
```

## Best Practices

1. **Component Modularization**:
   - Break down complex components into smaller, reusable pieces
   - Use consistent prop interfaces
   - Keep components focused on specific functionality

2. **Theme Consistency**:
   - Use theme colors and styles instead of hardcoded values
   - Apply proper responsive design using Chakra's responsive syntax
   - Use semantic components (Heading for headings, Text for text, etc.)

3. **Authentication Flow**:
   - Handle loading states properly
   - Provide clear error messages
   - Use secure token storage with cookies
   - Validate tokens on client-side

4. **Error Handling**:
   - Display user-friendly error messages
   - Log detailed errors to console for debugging
   - Handle different error types appropriately

5. **Routing**:
   - Use constants for route paths
   - Implement proper auth protection
   - Handle 404 cases gracefully

