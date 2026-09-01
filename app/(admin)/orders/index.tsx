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
      <Text style={styles.title}>Active orders</Text>
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
    backgroundColor: "#f4f6f1",
    flexGrow: 1,
    padding: 20,
    paddingTop: 32,
  },
  title: {
    color: "#1c2d2a",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d7ded8",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 17,
  },
  orderCardPressed: { backgroundColor: "#edf4ee" },
  drinkName: { color: "#1c2d2a", fontSize: 19, fontWeight: "700" },
  customer: { color: "#53605a", fontSize: 14, marginTop: 6 },
  message: {
    color: "#53605a",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 8,
  },
  empty: { color: "#53605a", fontSize: 16 },
});

export default AdminOrders;
