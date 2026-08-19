export default {
  expo: {
    name: 'Wander',
    slug: 'wander-app',
    scheme: 'wander',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#4F46E5',
    },
    userInterfaceStyle: 'light',
    plugins: ['expo-router'],
    
    extra: {
      eas: {
        projectId: "7d89bad4-e098-4933-96d4-37f5aa844c3c"
      }
    },
    
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.m4dm4n56.wander",
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
        
      },
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
};