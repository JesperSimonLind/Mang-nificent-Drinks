import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AdminLogin = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const adminPin = process.env.EXPO_PUBLIC_ADMIN_PIN;

  const handleLogin = () => {
    if (!adminPin) {
      setErrorMessage("Admin PIN has not been configured.");
      return;
    }

    if (pin !== adminPin) {
      setErrorMessage("Incorrect PIN.");
      return;
    }

    router.replace("/(admin)");
  };

  return (
    <ImageBackground
      source={require("../../assets/startscreen-bg.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={[styles.overlay, { paddingTop: insets.top + 20 }]}>
        <View pointerEvents="none" style={styles.topFade}>
          <View style={styles.fadeOpaque} />
          <View style={styles.fadeStrong} />
          <View style={styles.fadeMedium} />
          <View style={styles.fadeLight} />
        </View>
        <View style={styles.form}>
          <Text style={styles.eyebrow}>THE BAR</Text>
          <Text style={styles.title}>Admin login</Text>
          <Text style={styles.subtitle}>
            Enter the shared PIN to manage the bar.
          </Text>

          <Text style={styles.label}>PIN code</Text>
          <TextInput
            autoComplete="one-time-code"
            keyboardType="number-pad"
            onChangeText={(value) => {
              setPin(value);
              setErrorMessage("");
            }}
            placeholder="Enter PIN"
            placeholderTextColor="#7c7e7b"
            secureTextEntry
            style={styles.input}
            value={pin}
          />

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0, 7, 3, 0.45)",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  topFade: {
    height: 74,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  fadeOpaque: {
    backgroundColor: "#000000",
    height: 30,
  },
  fadeStrong: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    height: 18,
  },
  fadeMedium: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    height: 14,
  },
  fadeLight: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    height: 12,
  },
  form: {
    backgroundColor: "rgba(0, 7, 3, 0.9)",
    borderColor: "#40522c",
    borderRadius: 8,
    borderWidth: 2,
    padding: 22,
  },
  eyebrow: {
    color: "#93a688",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: "#d5d8d1",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#a4aaa0",
    fontSize: 16,
    marginTop: 8,
  },
  label: {
    color: "#b3c2a8",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "#5f743d",
    borderRadius: 6,
    borderWidth: 1,
    color: "#d5d8d1",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  error: {
    color: "#ad2c22",
    fontSize: 14,
    marginTop: 12,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderRadius: 8,
    marginTop: 26,
    paddingVertical: 15,
  },
  loginButtonPressed: {
    backgroundColor: "#566f27",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default AdminLogin;
