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

const DrinkDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDrink() {
      const fetchedDrink = await getDrinkById(id);
      setDrink(fetchedDrink);
      setIsLoading(false);
    }

    loadDrink();
  }, [id]);

  //   if (isLoading) {
  //     return <Text>Loading drink...</Text>;
  //   }

  if (!drink) {
    return <Text>Drink not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Signature drink</Text>
        <Text style={styles.name}>{drink.name}</Text>
        <Text style={styles.description}>{drink.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsList}>
          {drink.ingredients?.map((ingredient) => (
            <View key={ingredient} style={styles.ingredientRow}>
              <View style={styles.ingredientMarker} />
              <Text style={styles.ingredient}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.orderButton,
            pressed && styles.orderButtonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/order/[id]",
              params: { id: drink.id },
            })
          }
        >
          <Text style={styles.orderButtonText}>Order drink</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f1",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d7ded8",
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#1c2d2a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  eyebrow: {
    color: "#22644d",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  name: {
    color: "#1c2d2a",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 40,
  },
  description: {
    color: "#53605a",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  divider: {
    backgroundColor: "#d7ded8",
    height: 1,
    marginVertical: 24,
  },
  sectionTitle: {
    color: "#1c2d2a",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  ingredientMarker: {
    backgroundColor: "#df9d3a",
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  ingredient: {
    color: "#53605a",
    flex: 1,
    fontSize: 16,
  },
  orderButton: {
    alignItems: "center",
    backgroundColor: "#22644d",
    borderRadius: 6,
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  orderButtonPressed: {
    backgroundColor: "#174735",
  },
  orderButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default DrinkDetails;
