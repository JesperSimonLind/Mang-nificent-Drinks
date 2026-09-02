import { Stack } from "expo-router";

const DrinkLayout = () => {
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
      <Stack.Screen name="[id]" options={{ title: "Drink" }} />
    </Stack>
  );
};

export default DrinkLayout;
