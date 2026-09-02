import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

const styles = {
  backButton: {
    alignItems: "center" as const,
    height: 44,
    justifyContent: "center" as const,
    width: 44,
  },
};

const BackToHomeButton = () => {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Back to home"
      hitSlop={12}
      style={styles.backButton}
      onPress={() => router.navigate("/(user)")}
    >
      <Feather color="#b3c2a8" name="arrow-left" size={24} />
    </Pressable>
  );
};

const BackToMenuButton = () => {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Tillbaka till drinkmenyn"
      hitSlop={12}
      onPress={() => router.replace("/menu")}
      style={styles.backButton}
    >
      <Feather color="#b3c2a8" name="arrow-left" size={24} />
    </Pressable>
  );
};

const UserLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#b3c2a8",
        headerLeftContainerStyle: { paddingLeft: 12 },
        headerTitleAlign: "center",
        headerTitleStyle: { color: "#d5d8d1", fontSize: 16, fontWeight: "700" },
        headerShadowVisible: false,
        freezeOnBlur: true,
        sceneStyle: { backgroundColor: "#0a0a0a" },
        tabBarStyle: {
          backgroundColor: "#050906",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "transparent",
        },
        tabBarActiveTintColor: "#93a688",
        tabBarInactiveTintColor: "#7c7e7b",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="home" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          headerLeft: () => <BackToHomeButton />,
          title: "Drinkmeny",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name="glass-cocktail"
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wheel"
        options={{
          headerLeft: () => <BackToHomeButton />,
          title: "Wheel of destiny",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="disc" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="myorders"
        options={{
          headerLeft: () => <BackToHomeButton />,
          title: "Mina beställningar",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="clipboard" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="drink"
        options={{
          headerLeft: () => <BackToMenuButton />,
          href: null,
          title: "",
        }}
      />
      <Tabs.Screen name="order" options={{ href: null, headerShown: false }} />
      <Tabs.Screen
        name="order-confirmed"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen name="admin" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default UserLayout;
