# PlantCare Mobile

## Overview
PlantCare Mobile is a React Native application designed to help users manage and care for their plants. The app provides features such as tracking plant health, watering schedules, and notifications for plant care.

## Project Structure
The project is organized into several directories and files, each serving a specific purpose:

- **src/**: Contains the main application code.
  - **App.tsx**: The main entry point of the application.
  - **screens/**: Contains the different screens of the app.
    - **HomeScreen.tsx**: Displays a list of plants and their statuses.
    - **DetailScreen.tsx**: Shows detailed information about a selected plant.
    - **AnalyticsScreen.tsx**: Presents statistics and performance metrics for all plants.
    - **SettingsScreen.tsx**: Allows users to adjust app settings.
  - **components/**: Contains reusable components.
    - **PlantCard.tsx**: Represents an individual plant's information.
    - **NavigationBar.tsx**: Provides navigation options for the app.
    - **NotificationsModal.tsx**: Displays notifications related to plant care.
    - **AddPlantModal.tsx**: Allows users to add new plants.
  - **navigation/**: Sets up the navigation structure for the app.
    - **index.tsx**: Defines the routes and links screens.
  - **hooks/**: Contains custom hooks for state management.
    - **usePlants.ts**: Manages the state and logic related to plant data.
  - **services/**: Contains functions that manage sensor data.
    - **sensors.ts**: Simulates or manages sensor data for the plants.
  - **types/**: Exports TypeScript types and interfaces for type safety.
    - **index.ts**: Contains type definitions.
  - **utils/**: Contains utility functions for formatting data.
    - **format.ts**: Utility functions for formatting dates or numbers.
  - **styles/**: Defines theme and styling constants.
    - **theme.ts**: Contains styling constants used across the application.

- **app.json**: Configuration settings for the mobile app, including app name, version, and icon.
- **package.json**: Lists dependencies, scripts, and metadata for the project.
- **tsconfig.json**: Configuration file for TypeScript.
- **babel.config.js**: Babel configuration settings for transpiling the code.
- **README.md**: Documentation for the project.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- React Native CLI or Expo CLI installed.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd plantcare-mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the App
- For iOS:
  ```
  npm run ios
  ```

- For Android:
  ```
  npm run android
  ```

### Building the App
Follow the guidelines for building the app for iOS and Android using React Native CLI or Expo. Ensure all necessary configurations are set in `app.json`.

### Deployment
Follow the respective guidelines for deploying the app to the App Store or Google Play Store.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.