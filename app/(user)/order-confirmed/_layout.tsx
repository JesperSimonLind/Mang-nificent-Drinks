import { Stack } from "expo-router";

const OrderConfirmedLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#0a0a0a" },
        headerBackButtonDisplayMode: "minimal",
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#b3c2a8",
        headerTitleStyle: { color: "#d5d8d1", fontWeight: "700" },
      }}
    >
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OrderConfirmedLayout;
