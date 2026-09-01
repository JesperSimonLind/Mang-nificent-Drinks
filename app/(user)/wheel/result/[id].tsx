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
    backgroundColor: "#f4f6f1",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  centered: {
    alignItems: "center",
    backgroundColor: "#f4f6f1",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  eyebrow: {
    color: "#22644d",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#1c2d2a",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  image: {
    backgroundColor: "#d7ded8",
    borderRadius: 8,
    height: 215,
    marginTop: 24,
    width: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: "#df9d3a",
    borderRadius: 8,
    height: 215,
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  placeholderText: { color: "#1c2d2a", fontSize: 72, fontWeight: "700" },
  description: {
    color: "#53605a",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#22644d",
    borderRadius: 6,
    marginTop: 28,
    paddingVertical: 16,
    width: "100%",
  },
  primaryPressed: { backgroundColor: "#174735" },
  primaryButtonText: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#22644d",
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 15,
    width: "100%",
  },
  secondaryPressed: { backgroundColor: "#dce8df" },
  secondaryButtonText: { color: "#22644d", fontSize: 17, fontWeight: "700" },
  message: { color: "#53605a", fontSize: 16, textAlign: "center" },
});

export default WheelResult;
