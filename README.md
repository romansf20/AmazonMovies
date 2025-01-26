
# Welcome to Amazon Movies Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

The app features a **Home screen** with a horizontally scrollable movie carousel, as well as **Search** and **Profile screens** as placeholders.

### Features
- **Tabbed Layout**:
  - Includes three main tabs: Home, Search, and Profile.
- **Home Screen**:
  - Displays a list of top movies in a horizontally scrollable carousel.
	- Displays basic movie details in the carousel item.
  - Fetches and displays movies, genres, user ratings, and parental ratings via an API from: 
		- https://developer.themoviedb.org/docs/getting-started
  - Integrates a full-screen trailer player using a modal overlay.
	- Displays more movie details in the video player modal overlay.
  - Smooth animations for transitions using `react-native-reanimated-carousel`.
- **Search and Profile Screens**:
  - Placeholder screens with static text for future enhancements.

---

## Design Details

- **Responsive Layout**:
  - Designed to adapt to different screen sizes using `Dimensions`.
- **Reusable Styles**:
  - Centralized styles and helper functions in `movieCommon.tsx` for consistent design.
- **Animations**:
  - Smooth fade-in and fade-out animations for the trailer modal using the `Animated` API.
- **Typography**:
  - Uses the **Amazon Ember** font family for titles and text.
- **Dark Theme**:
  - Styled with dark mode UI elements, ensuring high contrast and readability.
- **Scalability**:
  - Modular architecture for easy addition of new features or components.

## Get started

1. Get API Key
- Sign up for an account at [TMDB](https://developer.themoviedb.org/)	
- Generate the key at https://developer.themoviedb.org/docs/getting-started
- add a .env file in your root directory.
- Add your API key as REACT_APP_TMDB_KEY=########

2. Install dependencies

   ```bash
   npm install
	 npx pod-install ios
	 npx react-native init 
   ```

3. Start the app

   ```bash
    npx expo start
		npm run ios  
		# Example of running on a specific device
		npx expo run:ios --device "iPhone 15"
		# Reset the Metro bundler cache:
		npx react-native start --reset-cache
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Folder Structure
```text
.
├── app/
│   ├── (tabs)/
│   │   ├── Home/
│   │   │   └── movieList.tsx
│   │   ├── Search.tsx
│   │   ├── Profile.tsx
│   ├── components/
│   │   ├── videoPlayerOverlay.tsx
│   │   ├── movieCommon.tsx
│   ├── services/
│   │   └── apiService.ts
│   ├── constants.ts
│   ├── types.ts
├── assets/
│   ├── fonts/
│   └── images/

## Key Files

- **movieList.tsx** [Home Screen Component]:
  - Displays a scrollable movie list.
  - Allows users to view movie trailers and details in a modal overlay.
- **videoPlayerOverlay.tsx**:
  - Full-screen trailer player with smooth fade-in/out animations.
  - Displays movie details (genres, director, cast) alongside the trailer.
- **movieCommon.tsx**:
  - Houses reusable styles and helper functions for genres, ratings, etc.
- **apiService.ts**:
  - Handles API requests for fetching movies, genres, and trailers.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
