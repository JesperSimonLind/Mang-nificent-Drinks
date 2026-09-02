import { useCallback, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";
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

const WHEEL_SIZE = 310;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = WHEEL_CENTER - 8;
const LABEL_RADIUS = 100;

const getWheelSegmentPath = (startAngle: number, endAngle: number) => {
  const startRadians = ((startAngle - 90) * Math.PI) / 180;
  const endRadians = ((endAngle - 90) * Math.PI) / 180;
  const startX = WHEEL_CENTER + WHEEL_RADIUS * Math.cos(startRadians);
  const startY = WHEEL_CENTER + WHEEL_RADIUS * Math.sin(startRadians);
  const endX = WHEEL_CENTER + WHEEL_RADIUS * Math.cos(endRadians);
  const endY = WHEEL_CENTER + WHEEL_RADIUS * Math.sin(endRadians);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${WHEEL_CENTER} ${WHEEL_CENTER} L ${startX} ${startY} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
};

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
  const featuredIndex = Math.floor(drinks.length / 4);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Snurra hjulet och låt ödet välja.</Text>

      <View style={styles.wheelArea}>
        <View style={styles.pointer} />
        <Animated.View
          style={[styles.wheel, { transform: [{ rotate: spin }] }]}
        >
          <Svg height={WHEEL_SIZE} width={WHEEL_SIZE}>
            {drinks.map((drink, index) => {
              const sliceAngle = 360 / drinks.length;
              return (
                <Path
                  d={getWheelSegmentPath(
                    index * sliceAngle,
                    (index + 1) * sliceAngle,
                  )}
                  fill={
                    index === featuredIndex
                      ? "#4f861d"
                      : index % 2 === 0
                        ? "#101b17"
                        : "#0b1210"
                  }
                  key={drink.id}
                  stroke="#334139"
                  strokeWidth={1}
                />
              );
            })}
            <Circle
              cx={WHEEL_CENTER}
              cy={WHEEL_CENTER}
              fill="none"
              r={WHEEL_RADIUS - 1}
              stroke="#b6ff45"
              strokeOpacity={0.95}
              strokeWidth={2}
            />
          </Svg>
          {drinks.map((drink, index) => {
            const angle = (360 / drinks.length) * index + 180 / drinks.length;
            const radians = (angle * Math.PI) / 180;
            const left = WHEEL_CENTER + Math.sin(radians) * LABEL_RADIUS - 42;
            const top = WHEEL_CENTER - Math.cos(radians) * LABEL_RADIUS - 18;
            return (
              <View
                key={drink.id}
                style={[styles.wheelLabel, { left, top }]}
              >
                <Text
                  numberOfLines={2}
                  style={[
                    styles.wheelLabelText,
                    index === featuredIndex && styles.featuredWheelLabelText,
                  ]}
                >
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
          <LinearGradient
            colors={["#4f861d", "#17380f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spinGradient}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? "SNURRAR" : "SPIN"}
            </Text>
          </LinearGradient>
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
    backgroundColor: "#0a0a0a",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  subtitle: {
    color: "#7c8a84",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  wheelArea: {
    alignItems: "center",
    height: WHEEL_SIZE,
    justifyContent: "center",
    marginTop: 20,
    width: WHEEL_SIZE,
  },
  wheel: {
    backgroundColor: "#07100d",
    borderColor: "#8bcf1d",
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 2,
    height: WHEEL_SIZE,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#8bcf1d",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    width: WHEEL_SIZE,
  },
  pointer: {
    borderBottomWidth: 0,
    borderColor: "transparent",
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderTopColor: "#b6ff45",
    borderTopWidth: 21,
    position: "absolute",
    top: -2,
    zIndex: 4,
  },
  wheelLabel: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    position: "absolute",
    width: 84,
  },
  wheelLabelText: {
    color: "#87908c",
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center",
  },
  featuredWheelLabelText: {
    color: "#d5e4c9",
    fontWeight: "700",
  },
  spinButton: {
    borderColor: "#9eea32",
    borderRadius: 34,
    borderWidth: 2,
    height: 68,
    overflow: "hidden",
    width: 68,
    zIndex: 3,
    shadowColor: "#8bcf1d",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  spinGradient: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  spinButtonPressed: { opacity: 0.7 },
  spinButtonText: {
    color: "#d5e4c9",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
  },
  message: {
    color: "#a4aaa0",
    fontSize: 16,
    marginTop: 28,
    textAlign: "center",
  },
  error: { color: "#d16054", fontSize: 16, marginTop: 28, textAlign: "center" },
});

export default Wheel;
