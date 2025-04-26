# SkyFox Cinema Frontend

## Overview

SkyFox Cinema Frontend is a modern, responsive web application built with **Next.js 13+** (App Router) and **Chakra UI**. The application provides a seamless experience for browsing movie shows, booking tickets, and managing cinema operations based on user roles (customer, staff, admin).

The frontend communicates with the [SkyFox Backend](https://github.com/iamsuteerth/skyfox-backend) through a secure API proxy architecture, ensuring sensitive backend details remain protected while delivering a complete movie booking experience.

## Key Features

### 🎬 Show Management System

The platform features a comprehensive show management system that allows administrators to:

- View all scheduled movie shows
- Schedule new movie shows through an intuitive dialog interface
- Select movies from a centralized database
- Choose available time slots for screenings
- Set ticket prices
- View real-time updates of the show schedule

### 🎟️ Booking Management Sytem

#### 🪑 Modular & Real-Time Booking

- **Multi-step Booking Dialogs:** Stepwise, interactive booking for both admin and customer flows-including movie info, seat selection, customer/payment details, and unified confirmations.
- **Interactive Seat Map:** Real-time seat map with clear Standard/Deluxe indicators and seat type-aware pricing.
- **Deluxe Seat Pricing:** Deluxe seats automatically add a configurable price offset, reflected live in all booking flows and summaries.
- **Booking Initialization & Seat Locking:** Seat locks are performed automatically when seats are selected; locks are released on failure, cancellation, close, or timeout.
- **Concurrent Booking Handling:** Backend and UI logic ensure seat locks and booking states are always accurate, even under high-traffic conditions.

#### 💳 Payment Flow & User Experience

- **Robust Payment Forms:** Custom credit card validation for number, expiry, CVV, and name-with clean, error-under-the-field UI.
- **Retry and Timeout Support:** Users can retry a failed payment if time permits; booking will time out gracefully if payment is not completed.
- **Strict Cancel Semantics:** Bookings are canceled only on explicit cancel actions or browser/tab close. The backend manages timeouts automatically.

#### 🧾 Downloadable PDF Tickets

- **Post-Booking Ticket Download:** Users can download their ticket instantly after a successful booking. The ticket is generated as a base64-encoded PDF and served directly through a secure proxy route.
- **Cross-browser Compatibility:** Download logic is robust and works on all modern browsers.

#### 🔁 Live Data Refresh

- **Auto-Refresh on Booking:** After a successful booking (admin or customer), closing the dialog automatically refreshes seat availability and show lists across the app-no reload necessary.

#### 🎨 Unified, Role-aware UI

- **Shared Booking Confirmation:** Both admin and customer flows use the same confirmation layout, automatically adjusting message and details for context.
- **Role-aware Logic:** All booking, management, and dialog flows adapt to the user’s role for seamless admin/staff/customer experiences.


### 🎭 Component Architecture

The application follows a modular, component-based architecture:

- **Reusable UI Components**: Shared UI elements across the application
- **Feature-Specific Components**: Specialized components for each feature area
- **Context-Driven State**: Global state management through React Context API
- **Typed Interfaces**: Full TypeScript implementation for type safety

### 🔄 Context-Based Dialog System

I've implemented a sophisticated dialog system using React Context:

```
contexts/dialog-context.tsx     # Central dialog state management
components/dialogs/             # Dialog implementation components
```

The dialog context provides a clean API for managing modal interactions:

- `openDialog(type, data)` - Opens a specific dialog with optional data
- `closeDialog()` - Closes the active dialog
- `currentDialog` - Currently active dialog type
- `dialogData` - Data passed to the dialog

This approach offers several advantages:
- Eliminates prop drilling across components
- Centralizes dialog state management
- Provides a consistent interface for all modal interactions
- Simplifies the implementation of complex workflows

> **Adding a new dialog only requires defining a new dialog component and updating the dialog context with its type. No need for state juggling across components.**

### 🔄 Real-Time Data Refresh

To ensure users always see the latest data after operations like scheduling shows, I've implemented a dedicated Shows Context:

```
contexts/shows-contex.tsx       # Manages shows refresh state
```

This context provides:
- A `refreshShows()` method that can be called from any component
- A `lastRefreshTime` timestamp that triggers data reloads
- Automatic refresh of shows data after CRUD operations

Components can subscribe to this context to receive refresh notifications without complex prop passing or event systems.

### 🔒 Authentication System

The application includes a comprehensive authentication system:

- **JWT-based Authentication**: Secure token-based authentication with cookie storage
- **Role-Based Access Control**: Different capabilities for customers, staff, and admins
- **Protected Routes**: Automatic redirection for unauthorized access attempts
- **Global Auth State**: Authentication context for application-wide access
- **Multi-step Password Recovery**: Secure password reset using security questions

### 🌐 API Proxy Architecture

The application implements a robust API proxy architecture:

- **Next.js API Routes**: Server-side proxy endpoints that communicate with the backend
- **Environment Variable Abstraction**: Backend details stored securely server-side
- **Service Layer**: TypeScript service modules for API communication
- **Error Handling**: Consistent error processing across all API interactions

This proxy architecture offers several significant advantages:

1. **Enhanced Security**: Sensitive backend URLs and API keys remain server-side
2. **Consistent Error Handling**: Standardized error processing across all API interactions
3. **Simplified Client Code**: Frontend components interact with relative URLs
4. **Centralized Request Processing**: Common request headers and authentication logic in one place
5. **Flexible Backend Migration**: Backend API changes only require updates to proxy endpoints

### 🧑‍💼 Profile Management System

The application features a comprehensive profile management system that provides:

- **Role-Based Profile Views**: Different profile information displayed based on user roles (customer, staff, admin)
- **Skeleton Loading States**: Elegant loading placeholders while fetching profile data
- **Role-Based Access Control (RBAC)**: Components conditionally rendered based on user roles with proper fallbacks
- **Secure Profile Updates**: Multi-step verification process with security questions
- **Profile Image Management**: Ability to update profile images with preview functionality
- **Change Password Functionality**: Secure password changing with current password verification

The profile implementation includes several advanced features:

- **Multi-Step Dialog Forms**: Two-tab dialog interface (information entry and security verification)
- **Validation Logic**: Prevents submission without actual changes to profile data
- **Security Question Verification**: Second-step security verification before sensitive changes
- **Profile Image Refresh System**: Efficient cache-busting mechanism for updated profile images
- **Form State Management**: useReducer implementation for complex form state handling

This profile system demonstrates sophisticated state management techniques:

- **Context API Integration**: Profile components leverage auth and dialog contexts
- **Reducer Pattern**: Complex form state managed with useReducer for better organization
- **Component Extraction**: Reusable security verification form shared across different dialogs
- **Memoization**: Event handlers optimized with useCallback
- **Image Processing**: Efficient image handling with proper cache invalidation

## Project Structure

The project follows a well-organized directory structure:

```
src/
├── app/                  # Next.js 13+ App Router pages and layouts
│   ├── api/              # API proxy routes
│   │   ├── customer/     # Customer-specific endpoints
│   │   ├── shows/        # Show management endpoints
│   │   └── ...           # Other API endpoints
│   ├── components/       # Shared UI components
│   │   ├── autocomplete/ # Custom MUI Autocomplete integration
│   │   ├── date-picker/  # Custom MUI DatePicker integration
│   │   ├── select/       # Custom MUI Select integration
│   │   └── ui/           # Core UI components
│   ├── login/            # Login page
│   ├── forgot-password/  # Password recovery flow
│   └── shows/            # Movie listings and management
│       └── components/
│           ├── dialogs/  # Show-related dialog components
│           └── ...       # Other show components
├── constants/            # Application constants
├── contexts/             # React contexts for state management
│   ├── auth-context.tsx  # Authentication state
│   ├── dialog-context.tsx # Dialog management
│   └── shows-contex.tsx  # Show refresh state management
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

### Example Structures

**Forgot Password Feature**:
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

**Shows Feature**:
```
app/shows/
├── components/
│   ├── dialogs/
│   │   └── schedule-show/
│   │       ├── schedule-show-dialog.tsx  # Show scheduling dialog
│   │       ├── price-input.tsx           # Custom price input
│   │       ├── summary-box.tsx           # Show summary display
│   │       └── utils.ts                  # Utility functions
│   ├── shows.tsx              # Main shows component
│   ├── shows-header.tsx       # Header with date selection
│   ├── shows-grid.tsx         # Grid display of shows
│   └── show-card.tsx          # Individual show display
└── page.tsx                   # Server component with metadata
```

**Profile Feature**:
```
app/profile/
├── components/
│   ├── dialogs/
│   │   ├── change-password/
│   │   │   └── change-password-dialog.tsx  # Password change dialog
│   │   ├── update-profile/
│   │   │   └── update-profile-dialog.tsx   # Profile update dialog
│   │   ├── update-profile-image/
│   │   │   └── update-profile-image-dialog.tsx  # Image update dialog
│   │   └── shared/
│   │       └── SecurityVerificationForm.tsx  # Shared security component
│   └── profile.tsx            # Main profile component
└── page.tsx                   # Server component with metadata
```

## Service Layer

### API Communication Abstraction

The service layer separates API communication from UI components:

- **Endpoint Constants**: All API endpoints are defined in the constants file
- **Type-Safe Services**: Each API endpoint has a dedicated function with TypeScript interfaces
- **Standard Error Handling**: Consistent approach to processing API errors
- **Response Processing**: Standardized handling of API responses

For example, the shows service provides functions for:
- Fetching all shows for a specific date
- Fetching available movies for scheduling
- Fetching available time slots
- Creating new show schedules

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
- **Responsive Breakpoints**: Consistent device size handling. The app seamlessly works on all device layouts!

### Custom Components

The theme extends Chakra UI with custom components like:

- **NeumorphicCard**: Cards with soft shadow effects
- **FormInput**: Enhanced form elements with validation states
- **Custom Buttons**: Application-specific button variants

## Frontend Validation

### Client-Side Input Validation

The application implements comprehensive validation:

- **Form-Level Validation**: Prevents submission of invalid data
- **Field-Level Validation**: Real-time feedback on input errors
- **Custom Validators**: Email, password strength, and other specific validations
- **Error Messages**: Clear, user-friendly validation error messages

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run the development server: `npm run dev`
5. Access the application at [http://localhost:3000](http://localhost:3000)

## Environment Configuration

The application requires the following environment variables:

```
# API Configuration
API_BASE_URL=
API_KEY=

# Environment Mode
NODE_ENV=development
```

The `API_BASE_URL` variable points to the SkyFox Backend API endpoint and is used throughout the application to construct API request URLs. The backend details are stored server-side and never exposed to clients.

The `API_KEY` variable provides the SkyFox Backend API Key required for authentication.

> **Developer Note:** When running in development mode, you can access the theme preview at [http://localhost:3000/theme-preview](http://localhost:3000/theme-preview) to see all theme components in one place.

