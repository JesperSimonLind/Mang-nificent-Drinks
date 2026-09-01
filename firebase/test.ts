import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./config";

export async function createTestDrink() {
  await addDoc(collection(db, "drinks"), {
    name: "Whiskey Sour",
    description: "En god läskande dryck som passar perfekt en varm sommardag.",
    ingredients: ["Bourbon", "Citron", "Sockerlag", "Äggvita"],
    available: true,
  });
}

export async function getDrinks() {
  const drinksSnapshot = await getDocs(collection(db, "drinks"));

  return drinksSnapshot.docs.map((drinkDocument) => ({
    id: drinkDocument.id,
    ...drinkDocument.data(),
  }));
}
