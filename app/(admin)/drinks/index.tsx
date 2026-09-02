import { useCallback, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDrinks, setDrinkAvailability } from "../../../firebase/test";
import ScreenEntrance from "../../../components/ScreenEntrance";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  available?: boolean;
};

const AdminDrinks = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <ScreenEntrance style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 10 },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Tillbaka till översikten"
            hitSlop={12}
            onPress={() => router.replace("/(admin)")}
            style={styles.headerIconButton}
          >
            <Feather color="#b3c2a8" name="arrow-left" size={21} />
          </Pressable>
          <Text style={styles.title}>DRINKAR</Text>
          <Pressable
            accessibilityLabel="Ny drink"
            onPress={() => router.push("/(admin)/drinks/new")}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addPressed,
            ]}
          >
            <Feather color="#d9ff8c" name="plus" size={20} />
          </Pressable>
        </View>
        {isLoading ? <Text style={styles.empty}>Loading drinks...</Text> : null}
        {!isLoading && !drinks.length ? (
          <Text style={styles.empty}>Inga drinkar ännu.</Text>
        ) : null}
        {drinks.map((drink) => (
          <View key={drink.id} style={styles.drinkCard}>
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
            <Pressable
              onPress={() => router.push(`/(admin)/drinks/${drink.id}`)}
              style={styles.drinkInfo}
            >
              <Text style={styles.name}>{drink.name ?? "Untitled drink"}</Text>
              <Text style={styles.description} numberOfLines={1}>
                {drink.description || "Ingen beskrivning"}
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
    </ScreenEntrance>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    minHeight: 42,
  },
  title: {
    color: "#aeb8b1",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  headerIconButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#1c3215",
    borderColor: "#587b2a",
    borderRadius: 20,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  addPressed: { backgroundColor: "#304c1a" },
  drinkCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    minHeight: 102,
    padding: 12,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.09,
    shadowRadius: 10,
  },
  drinkImage: {
    borderRadius: 6,
    height: 75,
    width: 75,
  },
  drinkImagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#1c2618",
    borderColor: "#4f663a",
    borderRadius: 6,
    borderWidth: 1,
    height: 75,
    justifyContent: "center",
    width: 75,
  },
  drinkInfo: { flex: 1, marginHorizontal: 12 },
  name: { color: "#c8d0ca", fontSize: 16, fontWeight: "700" },
  description: { color: "#737f78", fontSize: 12, lineHeight: 17, marginTop: 5 },
  empty: { color: "#a4aaa0", fontSize: 14, marginTop: 22, textAlign: "center" },
});

export default AdminDrinks;
