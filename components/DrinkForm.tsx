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
        placeholderTextColor="#7b8780"
        style={styles.input}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        placeholder="Describe the drink"
        placeholderTextColor="#7b8780"
        style={[styles.input, styles.descriptionInput]}
      />
      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Gin, tonic, lime"
        placeholderTextColor="#7b8780"
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
        placeholderTextColor="#7b8780"
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
          trackColor={{ false: "#b9c5bc", true: "#83b89d" }}
          thumbColor={available ? "#22644d" : "#ffffff"}
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
    color: "#1c2d2a",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 20,
  },
  labelInline: { color: "#1c2d2a", fontSize: 16, fontWeight: "700" },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#b9c5bc",
    borderRadius: 6,
    borderWidth: 1,
    color: "#1c2d2a",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  descriptionInput: { height: 100 },
  hint: { color: "#53605a", fontSize: 13, marginTop: 7 },
  availabilityRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  error: { color: "#ad2c22", fontSize: 14, marginTop: 16 },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#22644d",
    borderRadius: 6,
    marginTop: 26,
    paddingVertical: 16,
  },
  submitPressed: { backgroundColor: "#174735", opacity: 0.8 },
  submitText: { color: "#ffffff", fontSize: 17, fontWeight: "700" },
});

export default DrinkForm;
