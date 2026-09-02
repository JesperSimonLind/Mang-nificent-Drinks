import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getDrinkById } from "../../../firebase/test";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
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

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>Laddar drink...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>Drinken kunde inte hittas.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {drink.imageUrl ? (
        <Image source={{ uri: drink.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <MaterialCommunityIcons
            color="#ffbe55"
            name="glass-cocktail"
            size={68}
          />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{drink.name ?? "Okänd drink"}</Text>
        <Text style={styles.description}>{drink.description}</Text>

        <Text style={styles.sectionTitle}>INGREDIENSER</Text>
        {drink.ingredients?.length ? (
          <View style={styles.ingredientsList}>
            {drink.ingredients.map((ingredient) => (
              <View key={ingredient} style={styles.ingredientRow}>
                <View style={styles.ingredientMarker} />
                <Text style={styles.ingredient}>{ingredient}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noIngredients}>Inga ingredienser angivna.</Text>
        )}
      </View>

      <View style={styles.footer}>
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
          <Text style={styles.orderButtonText}>BESTÄLL DEN HÄR</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    paddingBottom: 22,
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
  image: {
    backgroundColor: "#10160f",
    height: 258,
    width: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#162516",
    borderBottomColor: "#40522c",
    borderBottomWidth: 1,
    height: 258,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  name: {
    color: "#d5d8d1",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
  },
  description: {
    color: "#87908c",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
  sectionTitle: {
    color: "#93a688",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 12,
    marginTop: 26,
  },
  ingredientsList: {
    gap: 9,
  },
  ingredientRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  ingredientMarker: {
    backgroundColor: "#829087",
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  ingredient: {
    color: "#909994",
    flex: 1,
    fontSize: 15,
  },
  noIngredients: {
    color: "#7c8a84",
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 28,
  },
  orderButton: {
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
  orderButtonPressed: {
    backgroundColor: "#566f27",
  },
  orderButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});

export default DrinkDetails;
