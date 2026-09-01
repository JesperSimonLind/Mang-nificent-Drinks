import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createOrder, getDrinkById } from "../../../firebase/test";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  ingredients?: string[];
};

const OrderDrink = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDrink() {
      try {
        const fetchedDrink = await getDrinkById(id);
        setDrink(fetchedDrink);
      } catch (error) {
        console.error("Unable to load drink for order:", error);
        setErrorMessage("Could not load this drink.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDrink();
  }, [id]);

  const handleSubmitOrder = async () => {
    if (!drink || !customerName.trim()) {
      setErrorMessage("Enter your name before sending the order.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await createOrder({
        drinkId: drink.id,
        drinkName: drink.name ?? "Untitled drink",
        customerName: customerName.trim(),
        message: message.trim(),
      });
      router.replace({
        pathname: "/order-confirmed/[id]",
        params: { id: drink.id },
      });
    } catch (error) {
      console.error("Unable to create order:", error);
      setErrorMessage("Could not send the order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>Loading order...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>
          {errorMessage || "Drink not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Din bestallning</Text>
      <Text style={styles.subtitle}>
        Kontrollera din drink och fyll i dina uppgifter.
      </Text>

      <View style={styles.drinkCard}>
        <Text style={styles.cardLabel}>Din drink</Text>
        <Text style={styles.drinkName}>{drink.name ?? "Untitled drink"}</Text>
        {drink.description ? (
          <Text style={styles.description}>{drink.description}</Text>
        ) : null}
        {drink.ingredients?.length ? (
          <Text style={styles.ingredients}>
            {drink.ingredients.join("  |  ")}
          </Text>
        ) : null}
      </View>

      <Text style={styles.label}>Ditt namn</Text>
      <TextInput
        autoCapitalize="words"
        onChangeText={setCustomerName}
        placeholder="Skriv ditt namn"
        placeholderTextColor="#7b8780"
        style={styles.input}
        value={customerName}
      />

      <Text style={styles.label}>Meddelande till bartendern</Text>
      <TextInput
        multiline
        onChangeText={setMessage}
        placeholder="Till exempel: utan agg (valfritt)"
        placeholderTextColor="#7b8780"
        style={[styles.input, styles.messageInput]}
        textAlignVertical="top"
        value={message}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Pressable
        disabled={isSubmitting}
        onPress={handleSubmitOrder}
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || isSubmitting) && styles.submitButtonPressed,
        ]}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Skickar..." : "Skicka bestallning"}
        </Text>
      </Pressable>
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
  centeredState: {
    alignItems: "center",
    backgroundColor: "#f4f6f1",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  stateText: {
    color: "#53605a",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    color: "#1c2d2a",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: "#53605a",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  drinkCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d7ded8",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 24,
    padding: 18,
  },
  cardLabel: {
    color: "#22644d",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  drinkName: {
    color: "#1c2d2a",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
  description: {
    color: "#53605a",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  ingredients: {
    color: "#22644d",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 12,
  },
  label: {
    color: "#1c2d2a",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#b9c5bc",
    borderRadius: 6,
    borderWidth: 1,
    color: "#1c2d2a",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  messageInput: {
    height: 112,
  },
  error: {
    color: "#ad2c22",
    fontSize: 14,
    marginTop: 12,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#22644d",
    borderRadius: 6,
    marginTop: 24,
    paddingVertical: 16,
  },
  submitButtonPressed: {
    backgroundColor: "#174735",
    opacity: 0.82,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default OrderDrink;
