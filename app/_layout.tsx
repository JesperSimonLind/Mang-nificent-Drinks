import { StatusBar } from "expo-status-bar";
import { DarkTheme, ThemeProvider } from "expo-router/react-navigation";
import { Stack } from "expo-router";
import { enableFreeze } from "react-native-screens";

enableFreeze(true);

export const unstable_settings = {
  initialRouteName: "index",
};

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0a0a0a",
    border: "#334229",
    card: "#0a0a0a",
    primary: "#b6ff45",
    text: "#d5d8d1",
  },
};

const RootLayout = () => {
  return (
    <ThemeProvider value={appTheme}>
      <StatusBar style="light" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          animation: "fade",
          animationDuration: 220,
          contentStyle: { backgroundColor: "#0a0a0a" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
