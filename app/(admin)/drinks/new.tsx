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
      <DrinkForm onSubmit={handleCreate} submitLabel="Create drink" />
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
});
export default NewDrink;
