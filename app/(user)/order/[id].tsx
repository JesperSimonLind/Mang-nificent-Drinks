import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createOrder, getDrinkById } from "../../../firebase/test";
import ScreenEntrance from "../../../components/ScreenEntrance";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
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
    <ScreenEntrance style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.drinkCard}>
          {drink.imageUrl ? (
            <Image source={{ uri: drink.imageUrl }} style={styles.drinkImage} />
          ) : (
            <View style={styles.drinkImagePlaceholder}>
              <MaterialCommunityIcons
                color="#ffbe55"
                name="glass-cocktail"
                size={28}
              />
            </View>
          )}
          <View style={styles.drinkInfo}>
            <Text style={styles.cardLabel}>Din drink</Text>
            <Text style={styles.drinkName}>{drink.name ?? "Okänd drink"}</Text>
          </View>
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

        <Text style={styles.label}>Meddelande till bartendern (valfritt)</Text>
        <TextInput
          multiline
          onChangeText={setMessage}
          placeholder="Till exempel: utan ägg (valfritt)"
          placeholderTextColor="#7b8780"
          style={[styles.input, styles.messageInput]}
          textAlignVertical="top"
          value={message}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <View style={styles.footer}>
          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmitOrder}
            style={({ pressed }) => [
              styles.submitButton,
              (pressed || isSubmitting) && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "SKICKAR..." : "SKICKA BESTÄLLNING"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenEntrance>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    padding: 22,
    paddingTop: 20,
  },
  centeredState: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  stateText: {
    color: "#a4aaa0",
    fontSize: 16,
    textAlign: "center",
  },
  drinkCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 94,
    padding: 12,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardLabel: {
    color: "#87908c",
    fontSize: 12,
    fontWeight: "400",
  },
  drinkName: {
    color: "#d5d8d1",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 4,
  },
  drinkImage: {
    borderRadius: 6,
    height: 68,
    width: 68,
  },
  drinkImagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#1d2616",
    borderColor: "#52663d",
    borderRadius: 6,
    borderWidth: 1,
    height: 68,
    justifyContent: "center",
    width: 68,
  },
  drinkInfo: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    color: "#b3c2a8",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#10160f",
    borderColor: "#40522c",
    borderRadius: 7,
    borderWidth: 1,
    color: "#d5d8d1",
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageInput: {
    height: 118,
  },
  error: {
    color: "#d16054",
    fontSize: 14,
    marginTop: 12,
  },
  footer: {
    borderTopColor: "#26342c",
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 42,
    paddingTop: 18,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderColor: "#9eea32",
    borderRadius: 10,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  submitButtonPressed: {
    backgroundColor: "#566f27",
    opacity: 0.82,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});

export default OrderDrink;
