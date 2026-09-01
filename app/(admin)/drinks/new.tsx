import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import DrinkForm, { DrinkValues } from "../../../components/DrinkForm";
import { createDrink } from "../../../firebase/test";

const NewDrink = () => {
  const router = useRouter();
  const handleCreate = async (values: DrinkValues) => {
    await createDrink(values);
    router.replace("/(admin)/drinks");
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New drink</Text>
      <DrinkForm onSubmit={handleCreate} submitLabel="Create drink" />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f6f1",
    flexGrow: 1,
    padding: 20,
    paddingTop: 32,
  },
  title: { color: "#1c2d2a", fontSize: 30, fontWeight: "700" },
});
export default NewDrink;
