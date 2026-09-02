import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getDrinkById,
  getOrderById,
  updateOrderStatus,
} from "../../../firebase/test";

type Order = {
  id: string;
  drinkId?: string;
  orderNumber?: number;
  customerName?: string;
  drinkName?: string;
  message?: string;
  status?: string;
};

type Drink = {
  imageUrl?: string;
};

const AdminOrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [drink, setDrink] = useState<Drink | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const fetchedOrder = (await getOrderById(id)) as Order | null;
        setOrder(fetchedOrder);
        if (fetchedOrder?.drinkId) {
          setDrink((await getDrinkById(fetchedOrder.drinkId)) as Drink | null);
        }
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
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              accessibilityLabel="Tillbaka till beställningar"
              hitSlop={12}
              onPress={() => router.replace("/(admin)/orders")}
              style={styles.headerBackButton}
            >
              <Feather color="#b3c2a8" name="arrow-left" size={22} />
            </Pressable>
          ),
          headerLeftContainerStyle: { paddingLeft: 12 },
          title: order.orderNumber ? `ORDER #${order.orderNumber}` : "ORDER",
        }}
      />

      <View>
        <View style={styles.orderCard}>
          {drink?.imageUrl ? (
            <Image source={{ uri: drink.imageUrl }} style={styles.drinkImage} />
          ) : (
            <View style={styles.drinkImagePlaceholder}>
              <MaterialCommunityIcons
                color="#ffbe55"
                name="glass-cocktail"
                size={27}
              />
            </View>
          )}
          <View style={styles.orderInfo}>
            <Text style={styles.customerName}>
              {order.customerName ?? "Okänd gäst"}
            </Text>
            <Text style={styles.drinkName}>
              {order.drinkName ?? "Okänd drink"}
            </Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>ANTECKNING</Text>
          <Text style={styles.noteText}>
            {order.message?.trim() || "Ingen anteckning."}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          disabled={isUpdating}
          onPress={() => handleStatusChange("completed")}
          style={({ pressed }) => [
            styles.doneButton,
            (pressed || isUpdating) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>MARKERA SOM KLAR</Text>
        </Pressable>
        <Pressable
          disabled={isUpdating}
          onPress={() => handleStatusChange("cancelled")}
          style={({ pressed }) => [
            styles.cancelButton,
            (pressed || isUpdating) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.cancelText}>AVBRYT ORDER</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flex: 1,
    padding: 20,
    paddingTop: 22,
    justifyContent: "space-between",
  },
  centered: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "center",
  },
  headerBackButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  orderCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 104,
    padding: 12,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  drinkImage: {
    borderRadius: 6,
    height: 78,
    width: 78,
  },
  drinkImagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#1d2616",
    borderColor: "#52663d",
    borderRadius: 6,
    borderWidth: 1,
    height: 78,
    justifyContent: "center",
    width: 78,
  },
  orderInfo: { flex: 1, marginLeft: 16 },
  customerName: { color: "#b0bbb3", fontSize: 15 },
  drinkName: {
    color: "#d5d8d1",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
  },
  statusDot: {
    backgroundColor: "#b6ff45",
    borderRadius: 3,
    height: 6,
    marginRight: 4,
    width: 6,
  },
  noteCard: {
    backgroundColor: "#0c1511",
    borderColor: "#263f32",
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 18,
    minHeight: 195,
    padding: 16,
  },
  noteLabel: {
    color: "#718078",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noteText: { color: "#a4aaa0", fontSize: 15, lineHeight: 22, marginTop: 12 },
  actions: { paddingTop: 8 },
  doneButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderColor: "#9eea32",
    borderRadius: 7,
    borderWidth: 1,
    height: 62,
    justifyContent: "center",
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: "#ad2c22",
    borderRadius: 7,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    marginTop: 12,
  },
  buttonPressed: { opacity: 0.75 },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  cancelText: {
    color: "#d16054",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  muted: { color: "#a4aaa0", fontSize: 16 },
});

export default AdminOrderDetails;
