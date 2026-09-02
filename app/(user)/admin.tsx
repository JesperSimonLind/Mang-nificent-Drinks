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
import ScreenEntrance from "../../components/ScreenEntrance";

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
        <ScreenEntrance style={styles.form}>
          <Text style={styles.eyebrow}>MAG-NIFICENT DRINKS / ADMIN</Text>
          <Text style={styles.title}>ADMININLOGGNING</Text>
          <Text style={styles.subtitle}>
            Ange PIN-koden för att administrera baren.
          </Text>

          <Text style={styles.label}>PIN-KOD</Text>
          <TextInput
            autoComplete="one-time-code"
            keyboardType="number-pad"
            onChangeText={(value) => {
              setPin(value);
              setErrorMessage("");
            }}
            placeholder="Ange PIN-kod"
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
            <Text style={styles.loginButtonText}>LOGGA IN</Text>
          </Pressable>
        </ScreenEntrance>
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
    alignSelf: "center",
    backgroundColor: "rgba(12, 21, 17, 0.94)",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 420,
    padding: 20,
    width: "100%",
  },
  eyebrow: {
    color: "#93a688",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  title: {
    color: "#d5d8d1",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  subtitle: {
    color: "#87908c",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  label: {
    color: "#87908c",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 7,
    marginTop: 22,
  },
  input: {
    backgroundColor: "rgba(16, 22, 15, 0.94)",
    borderColor: "#40522c",
    borderRadius: 5,
    borderWidth: 1,
    color: "#d5d8d1",
    fontSize: 14,
    height: 48,
    paddingHorizontal: 12,
  },
  error: {
    color: "#d16054",
    fontSize: 13,
    marginTop: 14,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderColor: "#9eea32",
    borderRadius: 7,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  loginButtonPressed: {
    backgroundColor: "#566f27",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default AdminLogin;
