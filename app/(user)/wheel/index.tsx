import { useCallback, useRef, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getDrinks } from "../../../firebase/test";

type Drink = {
  id: string;
  available?: boolean;
  name?: string;
};

const WHEEL_SIZE = 294;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const LABEL_RADIUS = 103;

const Wheel = () => {
  const router = useRouter();
  const rotation = useRef(new Animated.Value(0)).current;
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function loadDrinks() {
        try {
          setIsLoading(true);
          const fetchedDrinks = (await getDrinks()) as Drink[];
          setDrinks(fetchedDrinks.filter((drink) => drink.available !== false));
          setErrorMessage("");
        } catch (error) {
          console.error("Unable to load wheel drinks:", error);
          setErrorMessage("Could not load drinks for the wheel.");
        } finally {
          setIsLoading(false);
        }
      }

      loadDrinks();
    }, []),
  );

  const spinWheel = () => {
    if (!drinks.length || isSpinning) return;

    const winner = drinks[Math.floor(Math.random() * drinks.length)];
    const winnerIndex = drinks.findIndex((drink) => drink.id === winner.id);
    const sliceAngle = 360 / drinks.length;
    const winnerAngle = winnerIndex * sliceAngle + sliceAngle / 2;
    const landingAngle = 360 - winnerAngle;

    setIsSpinning(true);
    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 5 * 360 + landingAngle,
      duration: 3800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      router.push({
        pathname: "/wheel/result/[id]",
        params: { id: winner.id },
      });
      setIsSpinning(false);
    });
  };

  const spin = rotation.interpolate({
    inputRange: [0, 360 * 6],
    outputRange: ["0deg", "2160deg"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wheel of destiny</Text>
      <Text style={styles.subtitle}>Let the bar choose your next drink.</Text>

      <View style={styles.wheelArea}>
        <View style={styles.pointer} />
        <Animated.View
          style={[styles.wheel, { transform: [{ rotate: spin }] }]}
        >
          {drinks.map((drink, index) => {
            const angle = (360 / drinks.length) * index + 180 / drinks.length;
            const radians = (angle * Math.PI) / 180;
            const left = WHEEL_CENTER + Math.sin(radians) * LABEL_RADIUS - 42;
            const top = WHEEL_CENTER - Math.cos(radians) * LABEL_RADIUS - 18;
            return (
              <View key={drink.id} style={[styles.wheelLabel, { left, top }]}>
                <Text numberOfLines={2} style={styles.wheelLabelText}>
                  {drink.name ?? "Drink"}
                </Text>
              </View>
            );
          })}
        </Animated.View>
        <Pressable
          disabled={isSpinning || !drinks.length}
          onPress={spinWheel}
          style={({ pressed }) => [
            styles.spinButton,
            (pressed || isSpinning || !drinks.length) &&
              styles.spinButtonPressed,
          ]}
        >
          <Text style={styles.spinButtonText}>
            {isSpinning ? "Spinning" : "Spin"}
          </Text>
        </Pressable>
      </View>

      {isLoading ? <Text style={styles.message}>Loading drinks...</Text> : null}
      {!isLoading && !errorMessage && !drinks.length ? (
        <Text style={styles.message}>There are no available drinks yet.</Text>
      ) : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f4f6f1",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#1c2d2a",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#53605a",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    textAlign: "center",
  },
  wheelArea: {
    alignItems: "center",
    height: WHEEL_SIZE,
    justifyContent: "center",
    marginTop: 38,
    width: WHEEL_SIZE,
  },
  wheel: {
    backgroundColor: "#df9d3a",
    borderColor: "#1c2d2a",
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 6,
    height: WHEEL_SIZE,
    overflow: "hidden",
    position: "absolute",
    width: WHEEL_SIZE,
  },
  pointer: {
    borderBottomWidth: 0,
    borderColor: "transparent",
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopColor: "#ad2c22",
    borderTopWidth: 28,
    position: "absolute",
    top: -7,
    zIndex: 2,
  },
  wheelLabel: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    position: "absolute",
    width: 84,
  },
  wheelLabelText: {
    color: "#1c2d2a",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  spinButton: {
    alignItems: "center",
    backgroundColor: "#22644d",
    borderColor: "#ffffff",
    borderRadius: 46,
    borderWidth: 5,
    height: 92,
    justifyContent: "center",
    width: 92,
    zIndex: 1,
  },
  spinButtonPressed: { backgroundColor: "#174735", opacity: 0.8 },
  spinButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "700" },
  message: {
    color: "#53605a",
    fontSize: 16,
    marginTop: 28,
    textAlign: "center",
  },
  error: { color: "#ad2c22", fontSize: 16, marginTop: 28, textAlign: "center" },
});

export default Wheel;
