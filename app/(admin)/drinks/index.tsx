import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { getDrinks, setDrinkAvailability } from "../../../firebase/test";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  available?: boolean;
};

const AdminDrinks = () => {
  const router = useRouter();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadDrinks() {
        try {
          setDrinks((await getDrinks()) as Drink[]);
        } catch (error) {
          console.error("Unable to load admin drinks:", error);
        } finally {
          setIsLoading(false);
        }
      }
      loadDrinks();
    }, []),
  );

  const handleAvailabilityChange = async (drink: Drink, available: boolean) => {
    setDrinks((current) =>
      current.map((item) =>
        item.id === drink.id ? { ...item, available } : item,
      ),
    );
    try {
      await setDrinkAvailability(drink.id, available);
    } catch (error) {
      console.error("Unable to update drink availability:", error);
      setDrinks((current) =>
        current.map((item) =>
          item.id === drink.id ? { ...item, available: !available } : item,
        ),
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push("/(admin)/drinks/new")}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addPressed,
          ]}
        >
          <Text style={styles.addText}>Add drink</Text>
        </Pressable>
      </View>
      {isLoading ? <Text style={styles.empty}>Loading drinks...</Text> : null}
      {!isLoading && !drinks.length ? (
        <Text style={styles.empty}>No drinks yet.</Text>
      ) : null}
      {drinks.map((drink) => (
        <View key={drink.id} style={styles.drinkCard}>
          <Pressable
            onPress={() => router.push(`/(admin)/drinks/${drink.id}`)}
            style={styles.drinkInfo}
          >
            <Text style={styles.name}>{drink.name ?? "Untitled drink"}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {drink.description}
            </Text>
          </Pressable>
          <Switch
            value={drink.available === true}
            onValueChange={(value) => handleAvailabilityChange(drink, value)}
            trackColor={{ false: "#40522c", true: "#698530" }}
            thumbColor={drink.available ? "#d5d8d1" : "#a4aaa0"}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    padding: 20,
    paddingTop: 32,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#698530",
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  addPressed: { backgroundColor: "#566f27" },
  addText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  drinkCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    padding: 16,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.09,
    shadowRadius: 10,
  },
  drinkInfo: { flex: 1, marginRight: 14 },
  name: { color: "#d5d8d1", fontSize: 18, fontWeight: "700" },
  description: { color: "#a4aaa0", fontSize: 14, marginTop: 5 },
  empty: { color: "#a4aaa0", fontSize: 16 },
});

export default AdminDrinks;
