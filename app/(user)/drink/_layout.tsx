import { Stack } from "expo-router";

const DrinkLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#0a0a0a" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default DrinkLayout;
