import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { createTestDrink } from "../firebase/test";

const Home = () => {
  const router = useRouter();
  const [createDrinkStatus, setCreateDrinkStatus] = useState("");

  const handleCreateDrink = async () => {
    try {
      await createTestDrink();
      setCreateDrinkStatus("Drink created.");
    } catch (error) {
      console.error("Unable to create test drink:", error);
      setCreateDrinkStatus("Could not create drink.");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>The Bar</Text>
        <Text style={styles.subtitle}>Good drinks.</Text>
        <Text style={styles.subtitle}>Good times.</Text>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          onPress={() => router.push("/menu")}
        >
          <Text style={styles.btnText}>Drinkmeny</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          onPress={() => router.push("/wheel")}
        >
          <Text style={styles.btnText}>Wheel of destiny</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          onPress={handleCreateDrink}
        >
          <Text style={styles.btnText}>Create drink</Text>
        </Pressable>
        {createDrinkStatus ? (
          <Text style={styles.status}>{createDrinkStatus}</Text>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  pressed: {
    backgroundColor: "#0056b3",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
  },
  status: {
    marginTop: 10,
  },
});

export default Home;
