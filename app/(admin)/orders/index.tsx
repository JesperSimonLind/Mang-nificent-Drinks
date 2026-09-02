import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getOrders } from "../../../firebase/test";

type Order = {
  id: string;
  customerName?: string;
  drinkName?: string;
  message?: string;
  status?: string;
};

const AdminOrders = () => {
  const router = useRouter();
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
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? <Text style={styles.empty}>Loading orders...</Text> : null}
      {!isLoading && !activeOrders.length ? (
        <Text style={styles.empty}>No active orders.</Text>
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
          <Text style={styles.drinkName}>
            {order.drinkName ?? "Untitled drink"}
          </Text>
          <Text style={styles.customer}>
            For {order.customerName ?? "Unknown customer"}
          </Text>
          {order.message ? (
            <Text style={styles.message}>{order.message}</Text>
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    padding: 20,
    paddingTop: 32,
  },
  orderCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 17,
  },
  orderCardPressed: { backgroundColor: "#182b0f" },
  drinkName: { color: "#d5d8d1", fontSize: 19, fontWeight: "700" },
  customer: { color: "#a4aaa0", fontSize: 14, marginTop: 6 },
  message: {
    color: "#a4aaa0",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 8,
  },
  empty: { color: "#a4aaa0", fontSize: 16 },
});

export default AdminOrders;
