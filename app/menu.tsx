import { useEffect, useState } from "react";
import { getDrinks } from "../firebase/test";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  ingredients?: string[];
};

const Menu = () => {
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
        ListHeaderComponent={<Text style={styles.title}>Drinkmeny</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {isLoading
              ? "Loading drinks..."
              : errorMessage || "No drinks available yet."}
          </Text>
        }
        renderItem={({ item: drink }) => (
          <View style={styles.drinkCard}>
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
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f1",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
    gap: 12,
  },
  title: {
    color: "#1c2d2a",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  drinkCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d7ded8",
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
    gap: 8,
    shadowColor: "#1c2d2a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  drinkName: {
    color: "#1c2d2a",
    fontSize: 21,
    fontWeight: "700",
  },
  description: {
    color: "#53605a",
    fontSize: 15,
    lineHeight: 21,
  },
  ingredients: {
    color: "#22644d",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  emptyMessage: {
    color: "#53605a",
    fontSize: 16,
    paddingTop: 24,
    textAlign: "center",
  },
});

export default Menu;
