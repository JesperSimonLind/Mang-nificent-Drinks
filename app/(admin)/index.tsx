import { useCallback, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { Image, Pressable, Switch, StyleSheet, Text, View } from "react-native";
import {
  getBarStatus,
  getDrinks,
  getOrders,
  setBarStatus,
} from "../../firebase/test";

type Order = {
  completedAt?: { toDate?: () => Date };
  id: string;
  drinkId?: string;
  drinkName?: string;
  status?: string;
};

type Drink = {
  available?: boolean;
  id: string;
  imageUrl?: string;
};

const AdminDashboard = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadDashboard() {
        try {
          const [barIsOpen, fetchedOrders, fetchedDrinks] = await Promise.all([
            getBarStatus(),
            getOrders(),
            getDrinks(),
          ]);
          setIsOpen(barIsOpen);
          setOrders(fetchedOrders as Order[]);
          setDrinks(fetchedDrinks as Drink[]);
        } catch (error) {
          console.error("Unable to load admin dashboard:", error);
        } finally {
          setIsLoading(false);
        }
      }

      loadDashboard();
    }, []),
  );

  const handleBarStatusChange = async (value: boolean) => {
    setIsOpen(value);
    try {
      await setBarStatus(value);
    } catch (error) {
      console.error("Unable to update bar status:", error);
      setIsOpen(!value);
    }
  };

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled",
  );
  const completedOrders = orders.filter(
    (order) =>
      order.status === "completed" && wasCompletedToday(order.completedAt),
  );
  const menuDrinks = drinks.filter((drink) => drink.available !== false);
  const latestOrder = orders[0];
  const latestOrderDrink = drinks.find(
    (drink) => drink.id === latestOrder?.drinkId,
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.cardLabel}>BAREN ÄR</Text>
          <Text
            style={[styles.statusValue, !isOpen && styles.statusValueClosed]}
          >
            {isOpen ? "ÖPPEN" : "STÄNGD"}
          </Text>
        </View>
        <Switch
          onValueChange={handleBarStatusChange}
          trackColor={{ false: "#40522c", true: "#698530" }}
          thumbColor={isOpen ? "#d5d8d1" : "#a4aaa0"}
          value={isOpen}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="AKTIVA ORDER" value={activeOrders.length} />
        <StatCard label="KLARA IDAG" value={completedOrders.length} />
        <StatCard label="DRINKAR I MENYN" value={menuDrinks.length} />
      </View>

      <Text style={styles.sectionTitle}>SENASTE ORDER</Text>
      <View style={styles.latestOrderCard}>
        {isLoading ? (
          <Text style={styles.muted}>Loading dashboard...</Text>
        ) : null}
        {!isLoading && latestOrder ? (
          <View style={styles.latestOrderContent}>
            {latestOrderDrink?.imageUrl ? (
              <Image
                source={{ uri: latestOrderDrink.imageUrl }}
                style={styles.latestImage}
              />
            ) : (
              <View style={styles.latestImagePlaceholder}>
                <MaterialCommunityIcons
                  color="#ffbe55"
                  name="glass-cocktail"
                  size={23}
                />
              </View>
            )}
            <View>
              <Text style={styles.latestDrink}>
                {latestOrder.drinkName ?? "Okänd drink"}
              </Text>
              <Text style={styles.muted}>
                {latestOrder.status === "in-progress" ? "Pågår" : "Ny order"}
              </Text>
            </View>
          </View>
        ) : null}
        {!isLoading && !latestOrder ? (
          <Text style={styles.muted}>Inga ordrar ännu.</Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          router.dismissAll();
          router.replace("/(user)");
        }}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
      >
        <Feather color="#d16054" name="log-out" size={17} />
        <Text style={styles.logoutButtonText}>LOGGA UT</Text>
      </Pressable>
    </View>
  );
};

const wasCompletedToday = (completedAt: Order["completedAt"]) => {
  const completedDate = completedAt?.toDate?.();
  if (!completedDate) return false;

  return completedDate.toDateString() === new Date().toDateString();
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flex: 1,
    padding: 12,
    paddingTop: 14,
  },
  statusCard: {
    alignItems: "center",
    backgroundColor: "#062111",
    borderColor: "#164425",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  cardLabel: { color: "#70a372", fontSize: 12, fontWeight: "700" },
  statusValue: {
    color: "#a4df59",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  statusValueClosed: { color: "#d16054" },
  statsGrid: {
    columnGap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    rowGap: 16,
  },
  statCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 92,
    padding: 10,
    width: "48.7%",
  },
  statValue: {
    color: "#b8cbb5",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
  },
  statLabel: { color: "#708078", fontSize: 11, lineHeight: 15 },
  sectionTitle: {
    color: "#b3c2a8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 8,
  },
  latestOrderCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
  },
  latestOrderContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  latestImage: { borderRadius: 4, height: 44, width: 44 },
  latestImagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#1c2618",
    borderColor: "#4f663a",
    borderRadius: 4,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  latestDrink: {
    color: "#c3cbc4",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  muted: { color: "#708078", fontSize: 12, marginLeft: 10, marginTop: 4 },
  logoutButton: {
    alignItems: "center",
    borderColor: "#7f302b",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    marginTop: "auto",
  },
  logoutButtonPressed: { backgroundColor: "rgba(209, 96, 84, 0.12)" },
  logoutButtonText: {
    color: "#d16054",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginLeft: 8,
  },
});

export default AdminDashboard;
