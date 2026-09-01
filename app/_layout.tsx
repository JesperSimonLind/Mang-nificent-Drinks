import { Stack, Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const RootLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* <Stack /> */}
      <Tabs />
    </View>
  );
};

const styles = StyleSheet.create({});

export default RootLayout;
