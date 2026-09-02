import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getDrinks } from "../../firebase/test";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenEntrance from "../../components/ScreenEntrance";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  ingredients?: string[];
};

const Menu = () => {
  const router = useRouter();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredDrinks = drinks.filter((drink) => {
    if (!normalizedQuery) return true;
    return [drink.name, drink.description, ...(drink.ingredients ?? [])]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(normalizedQuery));
  });

  return (
    <ScreenEntrance style={styles.container}>
      <FlatList
        data={filteredDrinks}
        keyExtractor={(drink) => drink.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.searchRow}>
              <View style={styles.searchField}>
                <Feather color="#8a938e" name="search" size={16} />
                <TextInput
                  onChangeText={setSearchQuery}
                  placeholder="Sök drinkar..."
                  placeholderTextColor="#66716a"
                  style={styles.searchInput}
                  value={searchQuery}
                />
                {searchQuery ? (
                  <Pressable
                    accessibilityLabel="Rensa sökning"
                    hitSlop={8}
                    onPress={() => setSearchQuery("")}
                  >
                    <Feather color="#8a938e" name="x" size={16} />
                  </Pressable>
                ) : null}
              </View>
              <View style={styles.filterButton}>
                <Feather color="#b6ff45" name="filter" size={17} />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {isLoading
              ? "Laddar drinkar..."
              : errorMessage || "Inga drinkar hittades."}
          </Text>
        }
        renderItem={({ item: drink }) => (
          <Pressable
            style={({ pressed }) => [
              styles.drinkCard,
              pressed && styles.drinkCardPressed,
            ]}
            onPress={() =>
              router.push({ pathname: "drink/[id]", params: { id: drink.id } })
            }
          >
            {drink.imageUrl ? (
              <Image
                source={{ uri: drink.imageUrl }}
                style={styles.drinkImage}
              />
            ) : (
              <View style={styles.drinkImagePlaceholder}>
                <MaterialCommunityIcons
                  color="#ffbe55"
                  name="glass-cocktail"
                  size={25}
                />
              </View>
            )}
            <View style={styles.drinkDetails}>
              <Text style={styles.drinkName}>
                {drink.name ?? "Okänd drink"}
              </Text>
              {drink.ingredients?.length ? (
                <Text numberOfLines={1} style={styles.ingredients}>
                  {drink.ingredients.join(", ")}
                </Text>
              ) : drink.description ? (
                <Text numberOfLines={1} style={styles.ingredients}>
                  {drink.description}
                </Text>
              ) : null}
            </View>
            <Feather color="#8bcf1d" name="chevron-right" size={19} />
          </Pressable>
        )}
      />
    </ScreenEntrance>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  listHeader: {
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
  },
  searchField: {
    alignItems: "center",
    backgroundColor: "#0c1511",
    borderColor: "#25382f",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    height: 42,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: "#d5d8d1",
    flex: 1,
    fontSize: 13,
    marginLeft: 8,
    paddingVertical: 0,
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: "#101e15",
    borderColor: "#36552c",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  drinkCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    minHeight: 92,
    padding: 10,
  },
  drinkCardPressed: {
    backgroundColor: "#162516",
    borderColor: "#6a9728",
  },
  drinkImage: {
    borderRadius: 6,
    height: 70,
    width: 70,
  },
  drinkImagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#1c2618",
    borderColor: "#4f663a",
    borderRadius: 6,
    borderWidth: 1,
    height: 70,
    justifyContent: "center",
    width: 70,
  },
  drinkDetails: {
    flex: 1,
    marginHorizontal: 14,
  },
  drinkName: {
    color: "#d5d8d1",
    fontSize: 16,
    fontWeight: "700",
  },
  ingredients: {
    color: "#7f8984",
    fontSize: 12,
    marginTop: 4,
  },
  emptyMessage: {
    color: "#a4aaa0",
    fontSize: 16,
    paddingTop: 44,
    textAlign: "center",
  },
});

export default Menu;
