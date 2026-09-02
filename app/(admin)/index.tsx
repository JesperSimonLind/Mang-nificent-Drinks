import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, Switch, StyleSheet, Text, View } from "react-native";
import {
  getBarStatus,
  getDrinks,
  getOrders,
  setBarStatus,
} from "../../firebase/test";

type Order = {
  completedAt?: { toDate?: () => Date };
  id: string;
  drinkName?: string;
  status?: string;
};

type Drink = {
  available?: boolean;
  id: string;
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

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.cardLabel}>Bar status</Text>
          <Text style={styles.statusValue}>{isOpen ? "Open" : "Closed"}</Text>
        </View>
        <Switch
          onValueChange={handleBarStatusChange}
          trackColor={{ false: "#40522c", true: "#698530" }}
          thumbColor={isOpen ? "#d5d8d1" : "#a4aaa0"}
          value={isOpen}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Active orders" value={activeOrders.length} />
        <StatCard label="Finished today" value={completedOrders.length} />
        <StatCard label="Drinks on menu" value={menuDrinks.length} />
      </View>

      <Text style={styles.sectionTitle}>Latest order</Text>
      <View style={styles.latestOrderCard}>
        {isLoading ? (
          <Text style={styles.muted}>Loading dashboard...</Text>
        ) : null}
        {!isLoading && latestOrder ? (
          <>
            <Text style={styles.latestDrink}>
              {latestOrder.drinkName ?? "Untitled drink"}
            </Text>
            <Text style={styles.muted}>{latestOrder.status ?? "pending"}</Text>
          </>
        ) : null}
        {!isLoading && !latestOrder ? (
          <Text style={styles.muted}>No orders yet.</Text>
        ) : null}
      </View>

      <Pressable
        onPress={() => {
          router.dismissAll();
          router.replace("/(user)");
        }}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutPressed,
        ]}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
};

const wasCompletedToday = (completedAt: Order["completedAt"]) => {
  const completedDate = completedAt?.toDate?.();
  if (!completedDate) return false;

  return completedDate.toDateString() === new Date().toDateString();
};

const StatCard = ({ label, value }: { label: string; value: number }) => {
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
    padding: 20,
    paddingTop: 32,
  },
  statusCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    padding: 18,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  cardLabel: { color: "#a4aaa0", fontSize: 14 },
  statusValue: {
    color: "#d5d8d1",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  statsGrid: { flexDirection: "row", gap: 10, marginTop: 14 },
  statCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 112,
    padding: 14,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statValue: { color: "#93a688", fontSize: 28, fontWeight: "700" },
  statLabel: { color: "#a4aaa0", fontSize: 13, lineHeight: 18, marginTop: 8 },
  sectionTitle: {
    color: "#b3c2a8",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 12,
  },
  latestOrderCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  latestDrink: { color: "#d5d8d1", fontSize: 18, fontWeight: "700" },
  muted: { color: "#a4aaa0", fontSize: 15, marginTop: 5 },
  logoutButton: {
    alignItems: "center",
    borderColor: "#ad2c22",
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 28,
    paddingVertical: 14,
  },
  logoutPressed: { backgroundColor: "rgba(209, 96, 84, 0.15)" },
  logoutText: { color: "#d16054", fontSize: 16, fontWeight: "700" },
});

export default AdminDashboard;
