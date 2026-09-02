import { useCallback, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getOrders } from "../../../firebase/test";
import ScreenEntrance from "../../../components/ScreenEntrance";

type Order = {
  id: string;
  orderNumber?: number;
  customerName?: string;
  drinkName?: string;
  message?: string;
  status?: string;
};

const AdminOrders = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadOrders() {
        try {
          setOrders((await getOrders()) as Order[]);
        } catch (error) {
          console.error("Unable to load admin orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
      loadOrders();
    }, []),
  );

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled",
  );

  return (
    <ScreenEntrance style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 18 },
        ]}
      >
        <View style={styles.queueHeader}>
          <View>
            <Text style={styles.eyebrow}>BARTENDERKÖ</Text>
            <Text style={styles.queueTitle}>AKTIVA BESTÄLLNINGAR</Text>
          </View>
          <View style={styles.orderCount}>
            <Text style={styles.orderCountText}>{activeOrders.length}</Text>
          </View>
        </View>

        {isLoading ? (
          <Text style={styles.empty}>Laddar beställningar...</Text>
        ) : null}
        {!isLoading && !activeOrders.length ? (
          <View style={styles.emptyState}>
            <Feather color="#6a756e" name="coffee" size={30} />
            <Text style={styles.empty}>Inga aktiva beställningar.</Text>
          </View>
        ) : null}
        {activeOrders.map((order) => (
          <Pressable
            key={order.id}
            onPress={() => router.push(`/(admin)/orders/${order.id}`)}
            style={({ pressed }) => [
              styles.orderCard,
              pressed && styles.orderCardPressed,
            ]}
          >
            <View style={styles.orderNumber}>
              <Text style={styles.orderNumberText}>
                {order.orderNumber
                  ? String(order.orderNumber).padStart(2, "0")
                  : "--"}
              </Text>
            </View>
            <View style={styles.orderContent}>
              <View style={styles.orderTopRow}>
                <Text style={styles.drinkName}>
                  {order.drinkName ?? "Okänd drink"}
                </Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>
                    {order.status === "in-progress" ? "PÅGÅR" : "NY"}
                  </Text>
                </View>
              </View>
              <Text style={styles.customer}>
                {order.customerName ?? "Okänd gäst"}
              </Text>
              {order.message ? (
                <View style={styles.noteRow}>
                  <Feather color="#ffbe55" name="message-square" size={12} />
                  <Text numberOfLines={1} style={styles.message}>
                    {order.message}
                  </Text>
                </View>
              ) : null}
            </View>
            <Feather color="#8bcf1d" name="chevron-right" size={20} />
          </Pressable>
        ))}
      </ScrollView>
    </ScreenEntrance>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    padding: 20,
    paddingTop: 18,
  },
  queueHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  eyebrow: {
    color: "#87908c",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  queueTitle: {
    color: "#d5d8d1",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  orderCount: {
    alignItems: "center",
    backgroundColor: "#1b2e11",
    borderColor: "#698530",
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    minWidth: 32,
    paddingHorizontal: 8,
  },
  orderCountText: {
    color: "#b6ff45",
    fontSize: 13,
    fontWeight: "700",
  },
  orderCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    minHeight: 96,
    padding: 12,
  },
  orderCardPressed: { backgroundColor: "#182b0f" },
  orderNumber: {
    alignItems: "center",
    backgroundColor: "#192317",
    borderColor: "#40522c",
    borderRadius: 6,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  orderNumberText: { color: "#b6ff45", fontSize: 15, fontWeight: "700" },
  orderContent: { flex: 1, marginHorizontal: 12 },
  orderTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  drinkName: { color: "#d5d8d1", flex: 1, fontSize: 19, fontWeight: "700" },
  statusBadge: { alignItems: "center", flexDirection: "row", marginLeft: 8 },
  statusDot: {
    backgroundColor: "#b6ff45",
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  statusText: {
    color: "#a9c97d",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginLeft: 5,
  },
  customer: { color: "#8b958f", fontSize: 14, marginTop: 5 },
  noteRow: { alignItems: "center", flexDirection: "row", marginTop: 7 },
  message: {
    color: "#a4aaa0",
    flex: 1,
    fontSize: 13,
    marginLeft: 5,
  },
  empty: { color: "#a4aaa0", fontSize: 16 },
  emptyState: { alignItems: "center", marginTop: 80 },
});

export default AdminOrders;
