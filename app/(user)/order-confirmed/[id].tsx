import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getDrinkById } from "../../../firebase/test";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  ingredients?: string[];
};

const OrderConfirmed = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDrink() {
      try {
        const fetchedDrink = await getDrinkById(id);
        setDrink(fetchedDrink);
      } catch (error) {
        console.error("Unable to load confirmed drink:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDrink();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>Bekräftar din beställning...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>Din beställning skickades.</Text>
        <Pressable
          onPress={() => router.replace("/menu")}
          style={({ pressed }) => [
            styles.menuButton,
            pressed && styles.menuButtonPressed,
          ]}
        >
          <Text style={styles.menuButtonText}>Tillbaka till menyn</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Beställning skickad</Text>
      <Text style={styles.title}>Tack!</Text>
      <Text style={styles.subtitle}>
        Bartendern borjar med din drink snart.
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

      <Pressable
        onPress={() => router.replace("/menu")}
        style={({ pressed }) => [
          styles.menuButton,
          pressed && styles.menuButtonPressed,
        ]}
      >
        <Text style={styles.menuButtonText}>Tillbaka till menyn</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
  eyebrow: {
    color: "#93a688",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#d5d8d1",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    color: "#a4aaa0",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  drinkCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 28,
    padding: 20,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  cardLabel: {
    color: "#93a688",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  drinkName: {
    color: "#d5d8d1",
    fontSize: 23,
    fontWeight: "700",
    marginTop: 6,
  },
  description: {
    color: "#a4aaa0",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  ingredients: {
    color: "#93a688",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 12,
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderRadius: 8,
    marginTop: 28,
    paddingVertical: 16,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  menuButtonPressed: {
    backgroundColor: "#566f27",
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default OrderConfirmed;
