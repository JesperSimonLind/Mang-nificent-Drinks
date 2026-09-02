import { Stack } from "expo-router";

const AdminDrinksLayout = () => {
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
      <Stack.Screen name="new" options={{ title: "New drink" }} />
      <Stack.Screen name="[id]" options={{ title: "Edit drink" }} />
    </Stack>
  );
};

export default AdminDrinksLayout;
