import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import DrinkForm, { DrinkValues } from "../../../components/DrinkForm";
import ScreenEntrance from "../../../components/ScreenEntrance";
import { createDrink } from "../../../firebase/test";

const NewDrink = () => {
  const router = useRouter();
  const handleCreate = async (values: DrinkValues) => {
    await createDrink(values);
    router.replace("/(admin)/drinks");
  };
  return (
    <ScreenEntrance style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <DrinkForm onSubmit={handleCreate} submitLabel="Skapa drink" />
      </ScrollView>
    </ScreenEntrance>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
    padding: 20,
    paddingTop: 32,
  },
});
export default NewDrink;
