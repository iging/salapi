import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import {
  Firestore,
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
} from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebase?.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebase?.authDomain,
  projectId: Constants.expoConfig?.extra?.firebase?.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebase?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebase?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebase?.appId,
  measurementId: Constants.expoConfig?.extra?.firebase?.measurementId,
};

// Initialize Firebase - check if already initialized
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Analytics - only initialize on web where it's supported
let analytics: Analytics | null = null;
if (Platform.OS === "web") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Auth - check if already initialized
let auth: Auth;
if (getApps().length === 1) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = getAuth(app);
}

// Firestore - initialize with settings for React Native
let firestore: Firestore;
if (getApps().length === 1) {
  firestore = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalForceLongPolling: true,
  });
} else {
  firestore = getFirestore(app);
}

export { analytics, app, auth, firestore };
