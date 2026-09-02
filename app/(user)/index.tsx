import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getBarStatus } from "../../firebase/test";

const Home = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isBarOpen, setIsBarOpen] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadBarStatus() {
        try {
          setIsBarOpen(await getBarStatus());
        } catch (error) {
          console.error("Unable to load bar status:", error);
        }
      }

      loadBarStatus();
    }, []),
  );

  return (
    <ImageBackground
      source={require("../../assets/startscreen-bg.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View pointerEvents="none" style={styles.topFade}>
          <View style={styles.fadeOpaque} />
          <View style={styles.fadeStrong} />
          <View style={styles.fadeMedium} />
          <View style={styles.fadeLight} />
        </View>

        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/admin")}
            style={({ pressed }) => [
              styles.adminButton,
              pressed && styles.adminButtonPressed,
            ]}
          >
            <Text style={styles.adminButtonText}>Admin login</Text>
          </Pressable>

          <View style={styles.barStatusCard}>
            <View
              style={[styles.statusDot, !isBarOpen && styles.statusDotClosed]}
            />
            <View>
              <Text style={styles.statusLabel}>Baren är</Text>
              <Text
                style={[
                  styles.statusValue,
                  !isBarOpen && styles.statusValueClosed,
                ]}
              >
                {isBarOpen ? "öppen" : "stängd"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Image
            accessibilityLabel="The Bar"
            resizeMode="contain"
            source={require("../../assets/bar-logo.png")}
            style={styles.logo}
          />
          {/* <Text style={styles.subtitle}>Good drinks.</Text>
          <Text style={styles.subtitle}>Good times.</Text> */}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                styles.wheelBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/wheel")}
            >
              <Text style={[styles.btnText, styles.wheelBtnText]}>
                🎡 WHEEL OF DESTINY
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
              onPress={() => router.push("/menu")}
            >
              <Text style={styles.btnText}>🍹 DRINKMENY</Text>
            </Pressable>
          </View>
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
    backgroundColor: "rgba(0, 7, 3, 0.3)",
    flex: 1,
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
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  adminButton: {
    borderColor: "#698530",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  adminButtonPressed: {
    backgroundColor: "rgba(105, 133, 48, 0.1)",
  },
  adminButtonText: {
    color: "#698530",
    fontSize: 12,
    fontWeight: "600",
  },
  barStatusCard: {
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 10, 0.6)",
    borderColor: "#1b2315",
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  statusDot: {
    backgroundColor: "#698530",
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  statusDotClosed: {
    backgroundColor: "#ad2c22",
  },
  statusLabel: {
    color: "#6d6f68",
    fontSize: 11,
    fontWeight: "300",
  },
  statusValue: {
    color: "#698530",
    fontSize: 13,
    fontWeight: "400",
  },
  statusValueClosed: {
    color: "#d16054",
  },
  btn: {
    alignItems: "center",
    backgroundColor: "rgba(0, 5, 3, 0.86)",
    borderColor: "#93a688",
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 74,
    paddingHorizontal: 20,
    width: "100%",
  },
  wheelBtn: {
    backgroundColor: "rgba(24, 43, 15, 0.9)",
    borderColor: "#698530",
    shadowColor: "#b6ff45",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  actions: {
    marginTop: 34,
    maxWidth: 360,
    width: "100%",
  },
  pressed: {
    backgroundColor: "rgba(105, 133, 48, 0.2)",
  },
  logo: {
    height: 396,
    marginBottom: -48,
    maxWidth: "100%",
    width: 1170,
  },
  subtitle: {
    color: "#7c7e7b",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 4,
  },
  btnText: {
    color: "#d5d8d1",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 17,
    letterSpacing: 0,
  },
  wheelBtnText: {
    color: "#93a688",
  },
});

export default Home;
