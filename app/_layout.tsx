import { AuthProvider } from "@/contexts/auth-context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const StackLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          header: () => null,
          navigationBarHidden: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(modals)/profile-modal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/wallet-modal"
          options={{ presentation: "modal" }}
        />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
