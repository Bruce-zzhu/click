export default {
  expo: {
    name: 'Click',
    slug: 'click',
    owner: 'your-expo-account',
    version: '1.0.0',
    runtimeVersion: {
      policy: 'appVersion',
    },
    jsEngine: 'hermes',
    updates: {
      url: 'https://u.expo.dev/your-project-id',
    },
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#2A0FFF',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'au.clickai.click',
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'au.clickai.click',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',
      'expo-apple-authentication',
      [
        'expo-build-properties',
        {
          newArchEnabled: true,
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme:
            'com.googleusercontent.apps.207728140362-7oa0q2crk4h1jgnuoead8kga24tvhnrn',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
}
