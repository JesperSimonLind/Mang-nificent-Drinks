import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getDrinkById } from "../../../firebase/test";
import ScreenEntrance from "../../../components/ScreenEntrance";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
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
    <ScreenEntrance style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successHalo}>
          <View style={styles.successIcon}>
            <Feather color="#d9ff8c" name="check" size={64} />
          </View>
        </View>
        <Text style={styles.title}>TACK!</Text>
        <Text style={styles.subtitle}>
          Din beställning har tagits emot{`\n`}av bartendern.
        </Text>

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
            <Text style={styles.drinkName}>{drink.name ?? "Okänd drink"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.replace("/menu")}
          style={({ pressed }) => [
            styles.menuButton,
            pressed && styles.menuButtonPressed,
          ]}
        >
          <Text style={styles.menuButtonText}>TILLBAKA TILL MENYN</Text>
        </Pressable>
      </View>
    </ScreenEntrance>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "space-between",
    padding: 22,
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
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#b6ff45",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
    textShadowColor: "rgba(182, 255, 69, 0.45)",
    textShadowRadius: 10,
  },
  subtitle: {
    color: "#87908c",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
    textAlign: "center",
  },
  successHalo: {
    alignItems: "center",
    backgroundColor: "rgba(182, 255, 69, 0.05)",
    borderColor: "rgba(182, 255, 69, 0.2)",
    borderRadius: 70,
    borderWidth: 1,
    height: 140,
    justifyContent: "center",
    shadowColor: "#b6ff45",
    shadowOpacity: 0.32,
    shadowRadius: 20,
    width: 140,
  },
  successIcon: {
    alignItems: "center",
    backgroundColor: "#10200b",
    borderColor: "#b6ff45",
    borderRadius: 56,
    borderWidth: 2,
    height: 112,
    justifyContent: "center",
    width: 112,
  },
  drinkCard: {
    alignItems: "center",
    backgroundColor: "#10160f",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 34,
    minHeight: 92,
    padding: 12,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  drinkName: {
    color: "#d5d8d1",
    fontSize: 19,
    fontWeight: "700",
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
  footer: {
    paddingTop: 18,
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderColor: "#9eea32",
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    justifyContent: "center",
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  menuButtonPressed: {
    backgroundColor: "#566f27",
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});

export default OrderConfirmed;
