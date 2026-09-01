import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getOrders } from "../../firebase/test";

type Order = {
  id: string;
  customerName?: string;
  drinkName?: string;
  message?: string;
  status?: string;
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function loadOrders() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const fetchedOrders = await getOrders();
          setOrders(fetchedOrders as Order[]);
        } catch (error) {
          console.error("Unable to load orders:", error);
          setErrorMessage("Could not load orders.");
        } finally {
          setIsLoading(false);
        }
      }

      loadOrders();
    }, []),
  );

  const ongoingOrders = orders.filter((order) => order.status !== "completed");
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mina bestallningar</Text>

      {isLoading ? (
        <Text style={styles.stateText}>Loading orders...</Text>
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {!isLoading && !errorMessage ? (
        <>
          <OrderSection title="Pagaende" orders={ongoingOrders} />
          <OrderSection title="Klara" orders={completedOrders} />
        </>
      ) : null}
    </ScrollView>
  );
};

type OrderSectionProps = {
  title: string;
  orders: Order[];
};

const OrderSection = ({ title, orders }: OrderSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {orders.length ? (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.drinkName}>
                {order.drinkName ?? "Untitled drink"}
              </Text>
              <Text style={styles.status}>{order.status ?? "pending"}</Text>
            </View>
            <Text style={styles.customerName}>
              Bestalld av {order.customerName ?? "Unknown customer"}
            </Text>
            {order.message ? (
              <Text style={styles.message}>{order.message}</Text>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>
          {title === "Pagaende"
            ? "Inga pagaende bestallningar."
            : "Inga klara bestallningar annu."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f1",
    padding: 20,
    paddingTop: 32,
  },
  title: {
    color: "#1c2d2a",
    fontSize: 32,
    fontWeight: "700",
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: "#1c2d2a",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d7ded8",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 16,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  drinkName: {
    color: "#1c2d2a",
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
  },
  status: {
    color: "#22644d",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  customerName: {
    color: "#53605a",
    fontSize: 14,
    marginTop: 7,
  },
  message: {
    color: "#53605a",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 8,
  },
  emptyText: {
    color: "#53605a",
    fontSize: 15,
  },
  stateText: {
    color: "#53605a",
    fontSize: 16,
    marginTop: 24,
  },
  errorText: {
    color: "#ad2c22",
    fontSize: 16,
    marginTop: 24,
  },
});

export default MyOrders;
