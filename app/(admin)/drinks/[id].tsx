import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DrinkForm, { DrinkValues } from "../../../components/DrinkForm";
import { getDrinkById, updateDrink } from "../../../firebase/test";

type Drink = Partial<DrinkValues> & { id: string };

const EditDrink = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [drink, setDrink] = useState<Drink | null>(null);

  useEffect(() => {
    async function loadDrink() {
      try {
        setDrink((await getDrinkById(id)) as Drink | null);
      } catch (error) {
        console.error("Unable to load drink for editing:", error);
      }
    }
    loadDrink();
  }, [id]);

  const handleSave = async (values: DrinkValues) => {
    if (!drink) return;
    await updateDrink(drink.id, values);
    router.replace("/(admin)/drinks");
  };

  if (!drink)
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading drink...</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DrinkForm
        initialValues={{
          name: drink.name ?? "",
          description: drink.description ?? "",
          ingredients: drink.ingredients ?? [],
          available: drink.available ?? true,
          imageUrl: drink.imageUrl ?? "",
        }}
        onSubmit={handleSave}
        submitLabel="Spara"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    padding: 20,
    paddingTop: 16,
  },
  centered: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "center",
  },
  muted: { color: "#a4aaa0", fontSize: 16 },
});

export default EditDrink;
