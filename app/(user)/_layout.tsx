import { Tabs } from "expo-router";

const UserLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#050906",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "transparent",
        },
        tabBarActiveTintColor: "#93a688",
        tabBarInactiveTintColor: "#7c7e7b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen name="wheel" options={{ title: "Wheel" }} />
      <Tabs.Screen name="myorders" options={{ title: "My orders" }} />
      <Tabs.Screen name="drink" options={{ href: null }} />
      <Tabs.Screen name="order" options={{ href: null }} />
      <Tabs.Screen name="order-confirmed" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default UserLayout;
