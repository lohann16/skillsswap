# Skillswap

A peer-to-peer skill-sharing mobile application that connects users to learn and teach various skills in their local community.

## Overview

Skillswap is a React Native mobile application that enables users to connect with others to exchange skills. Whether you want to learn a new language, get guitar lessons, or teach someone your expertise, Skillswap makes it easy to find skill-sharing partners and build meaningful connections.

## Features

- **User Authentication**: Secure login and registration with Firebase
- **Skill Matching**: Discover users based on skills they teach and want to learn
- **Smart Matchmaking**: AI-powered algorithm to match compatible skill partners
- **Location-Based Discovery**: Find skill partners in your area
- **Onboarding System**: Guided setup to define your skills and preferences
- **User Profiles**: Comprehensive profiles with learning history and testimonials
- **In-App Messaging**: Real-time chat with matched partners
- **Notifications**: Stay updated on new matches and messages
- **Courses**: Browse and enroll in structured learning modules
- **Community Guidelines**: Community rules and safety standards

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation (Native Stack, Bottom Tabs)
- **Backend**: Firebase (Authentication, Realtime Database)
- **UI Components**: React Native Paper
- **Icons**: Expo Vector Icons
- **Language**: JavaScript (ES6+)

## Prerequisites

- Node.js (v18+) and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for macOS) or Android Emulator
- Firebase account with configured project

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd skillsswap
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Firebase
Firebase configuration is already set in `firebase/config.js`. Verify your credentials if needed:
- Update the `firebaseConfig` object with your Firebase project details
- Ensure Firebase Authentication and Realtime Database are enabled

### 4. Start the development server
```bash
npm start
# or
expo start
```

### 5. Run on device/emulator
```bash
# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web
```

## Project Structure

```
skillsswap/
├── screens/                          # All app screens
│   ├── OnboardingScreen.js          # Initial app setup
│   ├── LoginScreen.js               # User authentication
│   ├── Registration.js              # New user signup
│   ├── LanguageSelectScreen.js      # Language preferences
│   ├── SkillTeachInputScreen.js     # Input skills to teach
│   ├── SkillLearnInputScreen.js     # Input skills to learn
│   ├── DashboardScreen.js           # Main app dashboard
│   ├── DiscoverScreen.js            # Discover partners
│   ├── MatchesScreen.js             # View matches
│   ├── Matchmaking.js               # Matchmaking algorithm
│   ├── ChatScreen.js                # Messaging
│   ├── ContactsScreen.js            # User contacts
│   ├── ProfileScreen.js             # User profile
│   ├── CourseScreen.js              # Course browsing
│   ├── LearningHistoryScreen.js     # Learning progress
│   ├── LocationAvailabilityScreen.js# Location settings
│   ├── NotificationsScreen.js       # User notifications
│   ├── TestimonialScreen.js         # User testimonials
│   ├── CommunityRulesScreen.js      # Community guidelines
│   └── ContactsScreen.js            # Support/contact
├── stacks/                           # Navigation stacks
│   ├── OnboardingStack.js           # Onboarding flow
│   ├── SkillSetupStack.js           # Skill setup flow
│   └── MainAppStack.js              # Main app navigation
├── firebase/
│   └── config.js                    # Firebase configuration
├── styles/
│   └── globalStyles.js              # Global styling
├── components/
│   └── AssetExample.js              # Example component
├── assets/                           # Images, icons, etc.
├── App.js                           # Root app component
├── index.js                         # Entry point
├── package.json                     # Dependencies
└── README.md                        # This file
```

## Architecture

### Navigation Structure
The app uses a three-level navigation hierarchy:

1. **RootStack**: Main navigation between Onboarding, SkillSetup, and MainApp
2. **OnboardingStack**: Login/Registration flow
3. **SkillSetupStack**: Skill configuration flow
4. **MainAppStack**: Main application with bottom tab navigation

### Data Flow
- User data stored in Firebase Realtime Database
- Authentication managed through Firebase Auth
- Real-time updates for messages, notifications, and matches

## Development

### Running Tests
```bash
# To be implemented
```

### Code Structure Guidelines
- Keep components small and reusable
- Use functional components with React Hooks
- Centralize styling in `styles/globalStyles.js`
- Follow React Native best practices

### Common Tasks

**Adding a new screen:**
1. Create screen file in `screens/`
2. Add to appropriate stack in `stacks/`
3. Update navigation configuration

**Adding new dependencies:**
```bash
npm install <package-name>
# or
expo install <package-name>  # For Expo-compatible packages
```

## Troubleshooting

### App won't start
- Clear cache: `expo start -c`
- Reinstall node_modules: `rm -rf node_modules && npm install`
- Check Firebase configuration

### Firebase connection issues
- Verify API key and project ID in `firebase/config.js`
- Ensure Firebase services are enabled in your Firebase console
- Check internet connectivity

### Android/iOS emulator issues
- Ensure emulator is running before starting the app
- For iOS: Clear derived data if necessary
- For Android: Clear app cache in emulator settings

## Supported Platforms

- iOS 12+
- Android 5.0+ (API 21+)
- Web browsers (via Expo web)

## License

Licensed under 0BSD License

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Submit a Pull Request

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Last Updated**: 2026  
**Status**: Active Development
