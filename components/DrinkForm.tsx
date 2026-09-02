import { useState } from "react";
import {
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
  const [available, setAvailable] = useState(initialValues.available);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setErrorMessage("Name and description are required.");
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
      setErrorMessage("Could not save the drink. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Drink name"
        placeholderTextColor="#7c7e7b"
        style={styles.input}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        placeholder="Describe the drink"
        placeholderTextColor="#7c7e7b"
        style={[styles.input, styles.descriptionInput]}
      />
      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Gin, tonic, lime"
        placeholderTextColor="#7c7e7b"
        style={styles.input}
      />
      <Text style={styles.hint}>Separate ingredients with commas.</Text>
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        value={imageUrl}
        onChangeText={setImageUrl}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="https://..."
        placeholderTextColor="#7c7e7b"
        style={styles.input}
      />
      <View style={styles.availabilityRow}>
        <View>
          <Text style={styles.labelInline}>Show on menu</Text>
          <Text style={styles.hint}>Guests can only see available drinks.</Text>
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
          {isSaving ? "Saving..." : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#b3c2a8",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 20,
  },
  labelInline: { color: "#d5d8d1", fontSize: 16, fontWeight: "700" },
  input: {
    backgroundColor: "rgba(16, 22, 15, 0.94)",
    borderColor: "#40522c",
    borderRadius: 6,
    borderWidth: 1,
    color: "#d5d8d1",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  descriptionInput: { height: 100 },
  hint: { color: "#a4aaa0", fontSize: 13, marginTop: 7 },
  availabilityRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  error: { color: "#d16054", fontSize: 14, marginTop: 16 },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#698530",
    borderRadius: 8,
    marginTop: 26,
    paddingVertical: 16,
    shadowColor: "#b6ff45",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  submitPressed: { backgroundColor: "#566f27", opacity: 0.8 },
  submitText: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
});

export default DrinkForm;
