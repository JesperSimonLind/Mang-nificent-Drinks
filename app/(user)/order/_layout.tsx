import { Stack } from "expo-router";

const OrderLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        animationDuration: 220,
        animationMatchesGesture: true,
        contentStyle: { backgroundColor: "#0a0a0a" },
        headerBackButtonDisplayMode: "minimal",
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#b3c2a8",
        headerTitleStyle: { color: "#d5d8d1", fontWeight: "700" },
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Din beställning" }} />
    </Stack>
  );
};

export default OrderLayout;
