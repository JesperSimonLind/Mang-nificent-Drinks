import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOMER_ID_KEY = "customerId";

// Orders aren't tied to an account, so each device gets a random id that is
// saved on its orders and used to list only that customer's orders.
export async function getCustomerId() {
  const storedId = await AsyncStorage.getItem(CUSTOMER_ID_KEY);
  if (storedId) return storedId;

  const newId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
  await AsyncStorage.setItem(CUSTOMER_ID_KEY, newId);
  return newId;
}
