import { useEffect, useState } from "react";
import { getDrinks } from "../../firebase/test";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  ingredients?: string[];
};

const Menu = () => {
  const router = useRouter();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDrinks() {
      try {
        const fetchedDrinks = await getDrinks();
        setDrinks(fetchedDrinks);
      } catch (error) {
        console.error("Unable to load drinks:", error);
        setErrorMessage("Could not load the drinks.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDrinks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={drinks}
        keyExtractor={(drink) => drink.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {isLoading
              ? "Loading drinks..."
              : errorMessage || "No drinks available yet."}
          </Text>
        }
        renderItem={({ item: drink }) => (
          <Pressable
            style={styles.drinkCard}
            onPress={() =>
              router.push({ pathname: "drink/[id]", params: { id: drink.id } })
            }
          >
            <Text style={styles.drinkName}>
              {drink.name ?? "Untitled drink"}
            </Text>
            {drink.description ? (
              <Text style={styles.description}>{drink.description}</Text>
            ) : null}
            {drink.ingredients?.length ? (
              <Text style={styles.ingredients}>
                {drink.ingredients.join("  |  ")}
              </Text>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
    gap: 12,
  },
  drinkCard: {
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
    gap: 8,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  drinkName: {
    color: "#d5d8d1",
    fontSize: 21,
    fontWeight: "700",
  },
  description: {
    color: "#a4aaa0",
    fontSize: 15,
    lineHeight: 21,
  },
  ingredients: {
    color: "#93a688",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  emptyMessage: {
    color: "#a4aaa0",
    fontSize: 16,
    paddingTop: 24,
    textAlign: "center",
  },
});

export default Menu;
