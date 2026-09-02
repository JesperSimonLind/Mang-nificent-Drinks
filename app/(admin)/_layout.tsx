import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

const ExitAdminButton = () => {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Exit admin"
      hitSlop={12}
      onPress={() => {
        router.dismissAll();
        router.replace("/(user)");
      }}
    >
      <Feather color="#b3c2a8" name="arrow-left" size={24} />
    </Pressable>
  );
};

const AdminLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => <ExitAdminButton />,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#b3c2a8",
        headerTitleStyle: { color: "#d5d8d1", fontWeight: "700" },
        tabBarActiveTintColor: "#93a688",
        tabBarInactiveTintColor: "#7c7e7b",
        tabBarStyle: {
          backgroundColor: "#050906",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="bar-chart-2" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="clipboard" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="drinks"
        options={{
          title: "Drinks",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name="glass-cocktail"
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default AdminLayout;
