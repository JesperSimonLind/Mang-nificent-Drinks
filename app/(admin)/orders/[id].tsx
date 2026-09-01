import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getOrderById, updateOrderStatus } from "../../../firebase/test";

type Order = {
  id: string;
  customerName?: string;
  drinkName?: string;
  message?: string;
  status?: string;
};

const AdminOrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        setOrder((await getOrderById(id)) as Order | null);
      } catch (error) {
        console.error("Unable to load order:", error);
      }
    }
    loadOrder();
  }, [id]);

  const handleStatusChange = async (status: "completed" | "cancelled") => {
    if (!order) return;
    try {
      setIsUpdating(true);
      await updateOrderStatus(order.id, status);
      router.replace("/(admin)/orders");
    } catch (error) {
      console.error("Unable to update order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order)
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading order...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Order #{order.id.slice(-6).toUpperCase()}
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Drink</Text>
        <Text style={styles.drinkName}>
          {order.drinkName ?? "Untitled drink"}
        </Text>
        <Text style={styles.label}>Customer</Text>
        <Text style={styles.value}>
          {order.customerName ?? "Unknown customer"}
        </Text>
        {order.message ? (
          <>
            <Text style={styles.label}>Message</Text>
            <Text style={styles.value}>{order.message}</Text>
          </>
        ) : null}
      </View>
      <Pressable
        disabled={isUpdating}
        onPress={() => handleStatusChange("completed")}
        style={({ pressed }) => [
          styles.doneButton,
          (pressed || isUpdating) && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Mark as done</Text>
      </Pressable>
      <Pressable
        disabled={isUpdating}
        onPress={() => handleStatusChange("cancelled")}
        style={({ pressed }) => [
          styles.cancelButton,
          (pressed || isUpdating) && styles.buttonPressed,
        ]}
      >
        <Text style={styles.cancelText}>Cancel order</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f6f1",
    flex: 1,
    padding: 20,
    paddingTop: 32,
  },
  centered: {
    alignItems: "center",
    backgroundColor: "#f4f6f1",
    flex: 1,
    justifyContent: "center",
  },
  title: { color: "#1c2d2a", fontSize: 27, fontWeight: "700" },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d7ded8",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 24,
    padding: 20,
  },
  label: {
    color: "#22644d",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 18,
    textTransform: "uppercase",
  },
  drinkName: {
    color: "#1c2d2a",
    fontSize: 23,
    fontWeight: "700",
    marginTop: 6,
  },
  value: { color: "#53605a", fontSize: 16, lineHeight: 23, marginTop: 6 },
  doneButton: {
    alignItems: "center",
    backgroundColor: "#22644d",
    borderRadius: 6,
    marginTop: 26,
    paddingVertical: 16,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: "#ad2c22",
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 15,
  },
  buttonPressed: { opacity: 0.75 },
  buttonText: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
  cancelText: { color: "#ad2c22", fontSize: 17, fontWeight: "700" },
  muted: { color: "#53605a", fontSize: 16 },
});

export default AdminOrderDetails;
