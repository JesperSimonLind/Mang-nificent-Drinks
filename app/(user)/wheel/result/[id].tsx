import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getDrinkById } from "../../../../firebase/test";

type Drink = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
};

const WheelResult = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDrink() {
      try {
        setDrink((await getDrinkById(id)) as Drink | null);
      } catch (error) {
        console.error("Unable to load wheel result:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDrink();
  }, [id]);

  if (isLoading)
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Finding your drink...</Text>
      </View>
    );
  if (!drink)
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>We could not find that drink.</Text>
        <Pressable
          onPress={() => router.replace("/wheel")}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Spin again</Text>
        </Pressable>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Du fick</Text>
      <Text style={styles.title}>{drink.name ?? "a drink"}</Text>
      {drink.imageUrl ? (
        <Image source={{ uri: drink.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>
            {drink.name?.slice(0, 1).toUpperCase() ?? "D"}
          </Text>
        </View>
      )}
      {drink.description ? (
        <Text style={styles.description}>{drink.description}</Text>
      ) : null}
      <Pressable
        onPress={() =>
          router.push({ pathname: "/order/[id]", params: { id: drink.id } })
        }
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Order drink</Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace("/wheel")}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.secondaryPressed,
        ]}
      >
        <Text style={styles.secondaryButtonText}>Spin again</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 34,
  },
  centered: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  eyebrow: {
    color: "#93a688",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#d5d8d1",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  image: {
    backgroundColor: "#334229",
    borderRadius: 8,
    borderColor: "#698530",
    borderWidth: 1,
    height: 215,
    marginTop: 24,
    width: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderRadius: 8,
    borderColor: "#b3c2a8",
    borderWidth: 1,
    height: 215,
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  placeholderText: { color: "#ffffff", fontSize: 72, fontWeight: "700" },
  description: {
    color: "#a4aaa0",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderRadius: 8,
    marginTop: 28,
    paddingVertical: 16,
    width: "100%",
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  primaryPressed: { backgroundColor: "#566f27" },
  primaryButtonText: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#698530",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 15,
    width: "100%",
  },
  secondaryPressed: { backgroundColor: "#182b0f" },
  secondaryButtonText: { color: "#b3c2a8", fontSize: 17, fontWeight: "700" },
  message: { color: "#a4aaa0", fontSize: 16, textAlign: "center" },
});

export default WheelResult;
