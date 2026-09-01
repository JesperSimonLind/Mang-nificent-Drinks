import { StyleSheet, Text, View } from "react-native";

const MyOrders = () => {
  return (
    <View style={styles.container}>
      <Text>My Orders</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MyOrders;
