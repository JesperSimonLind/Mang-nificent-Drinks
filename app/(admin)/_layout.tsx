import { Tabs } from "expo-router";

const AdminLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="drinks" options={{ title: "Drinks" }} />
    </Tabs>
  );
};

export default AdminLayout;
