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
- Intuitive previous/next day navigation buttons for browsing shows across different dates with URL parameter synchronization.

### 💰 Digital Wallet Integration

- **Smart Wallet Payments:** Customers can pay for bookings directly using their SkyFox wallet balance with one-click payment.
- **Partial Wallet Payments:** When wallet balance is insufficient, the system intelligently handles partial payments - using available wallet funds and collecting the remaining amount via card.
- **Real-time Balance Display:** Wallet balance is prominently displayed with color-coded indicators (green for sufficient funds, red for insufficient).
- **Automatic Top-up:** Card payment details can be used to top up wallet during the booking process when balance is low.
- **Payment Method Toggle:** Intuitive toggle switch between wallet and card payment methods with dynamic UI updates.
- **Comprehensive Transaction History:** Customers can view their complete wallet transaction history with color-coded indicators for deposits and withdrawals.
- **Consistent Payment Experience:** The wallet experience maintains the same high-quality validation and error handling as the card payment system.

### 🎟️ Booking Management System

#### 🪑 Modular & Real-Time Booking

- **Multi-Step Dialogs:** Intuitive, interactive stepwise dialogs for both admin and customer booking flows-including movie info, seat selection, customer/payment details, and unified confirmation screens.
- **Live Seat Map & Pricing:** Instantly updated, interactive seat maps with clear Standard/Deluxe indicators and live, seat-type-aware pricing.
- **Deluxe Seat Handling:** Deluxe seats automatically add a configurable price premium, reflected in all calculations and summaries.
- **Automatic Seat Locking:** Seats are locked in real time upon selection and released promptly on cancellation, timeout, or booking failure.
- **Concurrent Booking Safe:** Advanced backend and frontend logic ensure reliable seat locks and booking states even under concurrent, high-traffic conditions.

### 🗂️ My Bookings & Latest Booking
- **Full Booking History:** Customers can view all their bookings-upcoming and completed-on a single, filterable page.
- **Profile Card:** Latest booking is always highlighted in the profile for quick access and convenience.
- **Details, QR, and Download:** Instantly access booking details, QR codes, and PDF tickets from both the "My Bookings" page and your profile.
- **Smart, User-Friendly Filtering:** Tabs filter bookings based on real movie times for a truly helpful experience.
- **Elegant Fallbacks:** Clean fallback UI for users with no bookings yet.

#### 💳 Seamless & Robust Payment Flow

- **Multiple Payment Options:** Flexible payment methods including card payments and wallet payments with intelligent handling of partial wallet payments.
- **Validated Payment Forms:** Clean, custom credit card forms with inline validation for number, expiry, CVV, and name-error messages appear directly under inputs.
- **Graceful Retry & Timeout:** Payment failures let users retry if time remains; timeouts are handled gracefully without messy UI errors.
- **Clear Cancel Handling:** Bookings are canceled only on explicit user action or browser/tab close; backend handles all timeout logic.
- **Timer Visualization:** Color-changing countdown timer provides visual feedback on remaining booking reservation time.

#### 🧾 Downloadable PDF Tickets

- **Instant Post-Booking Tickets:** Customers and admins can download tickets as PDF immediately after booking, served securely via proxy.
- **Cross-Browser Download:** Ticket downloads are robust and work perfectly on all modern browsers.

#### 🔁 Live Data Refresh

- **Automatic UI Updates:** After any booking, all relevant seat maps and show lists refresh instantly throughout the app-no reloads or manual refresh required.
- **Wallet Balance Synchronization:** Wallet balances update automatically after transactions for a consistent financial experience.

#### 🎨 Unified, Role-Aware Experience

- **Consistent Confirmation:** Both admin and customer flows use a single, unified confirmation component that automatically adapts text and details for the user's role.
- **Role-Based Logic Everywhere:** Booking, management, and dialog flows automatically adapt to admin, staff, or customer context for a smooth, personalized experience.


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

