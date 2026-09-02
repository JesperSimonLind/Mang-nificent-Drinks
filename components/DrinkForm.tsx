import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export type DrinkValues = {
  name: string;
  description: string;
  ingredients: string[];
  available: boolean;
  imageUrl: string;
};

type DrinkFormProps = {
  initialValues?: DrinkValues;
  onSubmit: (values: DrinkValues) => Promise<void>;
  submitLabel: string;
};

const emptyDrink: DrinkValues = {
  name: "",
  description: "",
  ingredients: [],
  available: true,
  imageUrl: "",
};

const DrinkForm = ({
  initialValues = emptyDrink,
  onSubmit,
  submitLabel,
}: DrinkFormProps) => {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [ingredients, setIngredients] = useState(
    initialValues.ingredients.join(", "),
  );
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);
  const [imageAspectRatio, setImageAspectRatio] = useState(4 / 3);
  const [available, setAvailable] = useState(initialValues.available);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const ingredientItems = ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  useEffect(() => {
    if (!imageUrl) return;

    Image.getSize(
      imageUrl,
      (width, height) => {
        if (width && height) setImageAspectRatio(width / height);
      },
      () => undefined,
    );
  }, [imageUrl]);

  const handleSubmit = async () => {
    if (isSaving) return;

    if (!name.trim() || !description.trim()) {
      setErrorMessage("Namn och beskrivning måste fyllas i.");
      return;
    }
    try {
      setIsSaving(true);
      setErrorMessage("");
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        ingredients: ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        available,
        imageUrl: imageUrl.trim(),
      });
    } catch (error) {
      console.error("Unable to save drink:", error);
      setErrorMessage("Kunde inte spara drinken. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  };

  const createFirestoreImageUrl = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 480 } }],
      {
        base64: true,
        compress: 0.35,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    if (!result.base64) {
      throw new Error("Kunde inte förbereda bilden.");
    }

    const dataUrl = `data:image/jpeg;base64,${result.base64}`;
    if (dataUrl.length > 650 * 1024) {
      throw new Error("Bilden är för stor. Välj en mindre bild.");
    }

    return { dataUrl, height: result.height, width: result.width };
  };

  const pickImage = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setErrorMessage(
        source === "camera"
          ? "Kameraåtkomst krävs för att ta en bild."
          : "Bildbiblioteksåtkomst krävs för att välja en bild.",
      );
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            mediaTypes: ["images"],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: ["images"],
            quality: 0.8,
          });

    if (!result.canceled) {
      try {
        const image = result.assets[0];
        const compressedImage = await createFirestoreImageUrl(image.uri);
        setImageUrl(compressedImage.dataUrl);
        setImageAspectRatio(compressedImage.width / compressedImage.height);
        setErrorMessage("");
      } catch (error) {
        console.error("Unable to prepare drink image:", error);
        setErrorMessage(
          "Kunde inte förbereda bilden. Försök med en mindre bild.",
        );
      }
    }
  };

  const handleImagePress = () => {
    Alert.alert("Lägg till bild", undefined, [
      { onPress: () => pickImage("camera"), text: "Ta foto" },
      { onPress: () => pickImage("library"), text: "Välj från bibliotek" },
      { style: "cancel", text: "Avbryt" },
    ]);
  };

  return (
    <View style={styles.form}>
      <Pressable
        accessibilityLabel="Lägg till drinkbild"
        onPress={handleImagePress}
        style={[styles.imagePreview, { aspectRatio: imageAspectRatio }]}
      >
        {imageUrl ? (
          <Image
            resizeMode="cover"
            source={{ uri: imageUrl }}
            style={styles.previewImage}
          />
        ) : (
          <View style={styles.previewPlaceholder}>
            <MaterialCommunityIcons
              color="#ffbe55"
              name="glass-cocktail"
              size={46}
            />
          </View>
        )}
        <View pointerEvents="none" style={styles.cameraBadge}>
          <Feather color="#d5d8d1" name="camera" size={16} />
        </View>
      </Pressable>

      <Text style={styles.label}>NAMN</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Drinkens namn"
        placeholderTextColor="#7c7e7b"
        style={styles.input}
      />
      <Text style={styles.label}>BESKRIVNING</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        placeholder="Beskriv drinken"
        placeholderTextColor="#7c7e7b"
        style={[styles.input, styles.descriptionInput]}
      />
      <Text style={styles.label}>INGREDIENSER</Text>
      <TextInput
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Bourbon, citron, socker"
        placeholderTextColor="#7c7e7b"
        style={styles.input}
      />
      {ingredientItems.length ? (
        <View style={styles.chips}>
          {ingredientItems.map((ingredient) => (
            <View key={ingredient} style={styles.chip}>
              <Text style={styles.chipText}>{ingredient}</Text>
              <Feather color="#b7c0b9" name="x" size={12} />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.hint}>Separera ingredienser med kommatecken.</Text>
      )}
      <View style={styles.availabilityRow}>
        <View>
          <Text style={styles.labelInline}>Tillgänglig</Text>
          <Text style={styles.hint}>Visas i drinkmenyn.</Text>
        </View>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{ false: "#40522c", true: "#698530" }}
          thumbColor={available ? "#d5d8d1" : "#a4aaa0"}
        />
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Pressable
        disabled={isSaving}
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || isSaving) && styles.submitPressed,
        ]}
      >
        <Text style={styles.submitText}>
          {isSaving ? "Sparar..." : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#87908c",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 7,
    marginTop: 16,
  },
  form: {
    paddingBottom: 10,
  },
  imagePreview: {
    alignItems: "center",
    backgroundColor: "#0c1511",
    borderColor: "#334229",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    height: "100%",
    width: "100%",
  },
  previewPlaceholder: {
    alignItems: "center",
    backgroundColor: "#172315",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  cameraBadge: {
    alignItems: "center",
    backgroundColor: "rgba(7, 16, 13, 0.88)",
    borderColor: "#52663d",
    borderRadius: 20,
    borderWidth: 1,
    bottom: 10,
    height: 40,
    justifyContent: "center",
    left: 10,
    position: "absolute",
    width: 40,
  },
  labelInline: { color: "#d5d8d1", fontSize: 15, fontWeight: "700" },
  input: {
    backgroundColor: "rgba(16, 22, 15, 0.94)",
    borderColor: "#40522c",
    borderRadius: 5,
    borderWidth: 1,
    color: "#d5d8d1",
    fontSize: 13,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  descriptionInput: { height: 76 },
  hint: { color: "#707a74", fontSize: 11, marginTop: 7 },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    alignItems: "center",
    backgroundColor: "#27342a",
    borderRadius: 5,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  chipText: { color: "#b7c0b9", fontSize: 11 },
  availabilityRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  error: { color: "#d16054", fontSize: 13, marginTop: 14 },
  submitButton: {
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
  submitPressed: { backgroundColor: "#566f27", opacity: 0.8 },
  submitText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});

export default DrinkForm;
