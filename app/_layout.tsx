import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Stack initialRouteName="(user)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </>
  );
};

export default RootLayout;
