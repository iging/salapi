# Salapi

A personal finance management mobile application that empowers users to track expenses, manage wallets, and gain insights into their spending habits through intuitive visualizations and comprehensive reporting.

---

## Project Overview

Salapi is a cross-platform mobile application built with React Native and Expo, designed for individuals who want to take control of their personal finances. The application provides a streamlined experience for recording transactions, organizing funds across multiple wallets, and analyzing financial patterns through statistical breakdowns.

**Target Audience:** Individual users seeking a lightweight, secure, and visually appealing solution for personal expense tracking and financial management.

---

## Key Features

- **Multi-Wallet Management:** Create and manage multiple wallets to organize funds by purpose (e.g., savings, daily expenses, emergency fund)
- **Transaction Tracking:** Record income and expenses with categories, descriptions, dates, and optional receipt images
- **Real-Time Balance Calculation:** Automatic wallet balance updates based on recorded transactions
- **Statistical Analytics:** Visualize spending patterns with weekly, monthly, and yearly bar charts
- **Data Export:** Generate and share transaction reports in PDF format with customizable date ranges
- **Secure Authentication:** Email-based registration with verification, password recovery, and account management
- **Search Functionality:** Filter and search transactions by category, description, or amount
- **Cloud Image Storage:** Attach receipt images to transactions via Cloudinary integration
- **Pull-to-Refresh:** Real-time data synchronization across all screens
- **Dark Theme UI:** Modern dark interface optimized for reduced eye strain

---

## Tech Stack

### Core Framework

| Technology          | Purpose                               |
| ------------------- | ------------------------------------- |
| React Native 0.81.5 | Cross-platform mobile framework       |
| Expo SDK 54         | Development toolchain and native APIs |
| TypeScript 5.9      | Type-safe development                 |

### Navigation and Routing

| Technology           | Purpose                   |
| -------------------- | ------------------------- |
| Expo Router 6.x      | File-based routing system |
| React Navigation 7.x | Stack and tab navigation  |

### Backend and Database

| Technology              | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| Firebase Authentication | User authentication and session management |
| Cloud Firestore         | Real-time NoSQL database                   |
| Cloudinary              | Image upload and storage                   |

### State Management and Forms

| Technology          | Purpose                      |
| ------------------- | ---------------------------- |
| React Context API   | Global authentication state  |
| React Hook Form 7.x | Form handling and validation |
| Zod 4.x             | Schema validation            |

### UI and Visualization

| Technology                   | Purpose                   |
| ---------------------------- | ------------------------- |
| React Native Reanimated 4.x  | Smooth animations         |
| React Native Gesture Handler | Touch interactions        |
| Phosphor Icons               | Icon library              |
| React Native Gifted Charts   | Statistical bar charts    |
| Expo Image                   | Optimized image rendering |

### Utilities

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| Moment.js    | Date formatting and manipulation |
| Axios        | HTTP client for API requests     |
| Expo Print   | PDF generation                   |
| Expo Sharing | File sharing functionality       |
| AsyncStorage | Local data persistence           |

---

## Installation and Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development) or Xcode (for iOS development)
- Firebase project with Authentication and Firestore enabled
- Cloudinary account for image uploads

### Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
EXPO_PUBLIC_SUPER_ACCOUNT_UID=optional_dev_super_account
```

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/iging/salapi.git

# Navigate to project directory
cd salapi

# Install dependencies
npm install

# Start the development server
npm start or npx expo start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

---

## Usage

### Authentication Flow

1. Launch the application to view the splash screen
2. New users select "Register" to create an account with name, email, and password
3. Verify email address through the confirmation link sent to the registered email
4. Log in with verified credentials to access the main application

### Core Operations

**Creating a Wallet:**

1. Navigate to the Wallet tab
2. Tap the plus icon in the header
3. Enter wallet name and optional starting balance
4. Attach an optional wallet icon image
5. Save to create the wallet

**Recording a Transaction:**

1. Tap the floating action button on the Home screen
2. Select transaction type (Income or Expense)
3. Choose the target wallet
4. Enter amount, category, date, and optional description
5. Attach a receipt image if needed
6. Submit to record the transaction

**Viewing Statistics:**

1. Navigate to the Statistics tab
2. Use the segmented control to switch between Weekly, Monthly, and Yearly views
3. Scroll through the chart to view income vs. expense comparisons
4. Review recent transactions below the chart

**Exporting Data:**

1. Navigate to Profile and access Settings
2. Select the Export option
3. Choose date range using the date picker
4. Generate and share the PDF report

---

## Architecture Brief

### Folder Structure

```
salapi/
├── app/                    # Expo Router screens and layouts
│   ├── (auth)/            # Authentication screens (login, register, forgot-password)
│   ├── (tabs)/            # Main tab screens (home, statistics, wallet, profile)
│   ├── (modals)/          # Modal screens (transaction, wallet, search, settings)
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   ├── skeletons/         # Loading skeleton components
│   └── privacy-policy/    # Privacy policy components
├── config/                # Firebase and external service configuration
├── constants/             # Theme colors, spacing, and static data
├── contexts/              # React Context providers (AuthContext)
├── hooks/                 # Custom React hooks (useFetchData)
├── schema/                # Zod validation schemas
├── services/              # Firebase and API service functions
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions (currency, styling, errors)
└── assets/                # Images and logo assets
```

### Data Flow Architecture

1. **Entry Point:** The root `_layout.tsx` wraps the application with `AuthProvider` and `SafeAreaProvider`

2. **Authentication Layer:** The `AuthContext` manages user state, providing `login`, `register`, `logout`, and `updateUserData` functions. Firebase Authentication handles session persistence via AsyncStorage.

3. **Routing:** Expo Router implements file-based routing with three route groups:

   - `(auth)` - Unauthenticated screens with stack navigation
   - `(tabs)` - Main authenticated screens with custom bottom tab navigation
   - `(modals)` - Overlay screens presented as modals

4. **Data Fetching:** The `useFetchData` custom hook establishes real-time Firestore subscriptions with `onSnapshot`, providing automatic UI updates when data changes.

5. **Service Layer:** Service modules (`transaction.services.ts`, `wallet.services.ts`, `user.services.ts`) encapsulate all Firestore operations with ownership validation and error handling.

6. **Form Handling:** React Hook Form with Zod resolvers manage form state and validation, with schemas defined in the `schema/` directory.

### Component Interaction

- **Screen Components** consume `AuthContext` for user data and call service functions for CRUD operations
- **UI Components** receive props from parent screens and emit events through callbacks
- **Skeleton Components** display during loading states to improve perceived performance
- **The `useFetchData` hook** provides data, loading, error, and refresh states to consuming components

---

## Scripts

| Command                       | Description                              |
| ----------------------------- | ---------------------------------------- |
| `npm start or npx expo start` | Start the Expo development server        |
| `npm run android`             | Build and run on Android device/emulator |
| `npm run ios`                 | Build and run on iOS simulator           |
| `npm run web`                 | Start the web version                    |
| `npm run lint`                | Run ESLint for code quality checks       |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
