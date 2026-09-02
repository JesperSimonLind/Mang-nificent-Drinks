import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getOrders } from "../../firebase/test";
import ScreenEntrance from "../../components/ScreenEntrance";

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
    <ScreenEntrance style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          <Text style={styles.stateText}>Loading orders...</Text>
        ) : null}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {!isLoading && !errorMessage ? (
          <>
            <OrderSection title="Pågående" orders={ongoingOrders} />
            <OrderSection title="Klara" orders={completedOrders} />
          </>
        ) : null}
      </ScrollView>
    </ScreenEntrance>
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
              Beställd av {order.customerName ?? "Okänd gäst"}
            </Text>
            {order.message ? (
              <Text style={styles.message}>{order.message}</Text>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>
          {title === "Pågående"
            ? "Inga pågående beställningar."
            : "Inga klara beställningar ännu."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
    paddingTop: 32,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: "#b3c2a8",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 16,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.09,
    shadowRadius: 10,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  drinkName: {
    color: "#d5d8d1",
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
  },
  status: {
    color: "#93a688",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  customerName: {
    color: "#a4aaa0",
    fontSize: 14,
    marginTop: 7,
  },
  message: {
    color: "#a4aaa0",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 8,
  },
  emptyText: {
    color: "#a4aaa0",
    fontSize: 15,
  },
  stateText: {
    color: "#a4aaa0",
    fontSize: 16,
    marginTop: 24,
  },
  errorText: {
    color: "#d16054",
    fontSize: 16,
    marginTop: 24,
  },
});

export default MyOrders;
