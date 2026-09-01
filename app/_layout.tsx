import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(user)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
};

export default RootLayout;
