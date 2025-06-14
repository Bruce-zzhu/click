// Configure error boundaries and reporting first
import { LogBox } from 'react-native'

// Suppress specific warnings that are known and can't be fixed
LogBox.ignoreLogs([
  'Overwriting fontFamily style attribute preprocessor',
  // Add any other warnings to ignore here
])

// Use the actual App component from expo-router
import { App } from 'expo-router/build/qualified-entry'
import { renderRootComponent } from 'expo-router/build/renderRootComponent'

// This file should only import and register the root.
// For global setup, import additional files with initialization code
renderRootComponent(App)
