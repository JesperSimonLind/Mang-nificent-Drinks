import { Stack } from "expo-router";

const WheelLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#0a0a0a" },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#b3c2a8",
        headerTitleStyle: { color: "#d5d8d1", fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
    </Stack>
  );
};

export default WheelLayout;
