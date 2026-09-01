import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

export async function createTestDrink() {
  await addDoc(collection(db, "drinks"), {
    name: "Whiskey Sour",
    description: "En god läskande dryck som passar perfekt en varm sommardag.",
    ingredients: ["Bourbon", "Citron", "Sockerlag", "Äggvita"],
    available: true,
  });

  await addDoc(collection(db, "drinks"), {
    name: "Mojito",
    description: "En frisk drink med mynta, lime och rom.",
    ingredients: ["Ljus rom", "Lime", "Mynta", "Sockerlag", "Sodavatten"],
    available: true,
  });

  await addDoc(collection(db, "drinks"), {
    name: "Negroni",
    description: "En bittersöt klassiker med gin och vermouth.",
    ingredients: ["Gin", "Campari", "Söt vermouth"],
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

export async function getDrinkById(id: string) {
  const drinkDoc = await getDoc(doc(db, "drinks", id));

  if (!drinkDoc.exists()) {
    return null;
  }

  return {
    id: drinkDoc.id,
    ...drinkDoc.data(),
  };
}

type CreateOrderInput = {
  drinkId: string;
  drinkName: string;
  customerName: string;
  message: string;
};

export async function createOrder({
  drinkId,
  drinkName,
  customerName,
  message,
}: CreateOrderInput) {
  await addDoc(collection(db, "orders"), {
    drinkId,
    drinkName,
    customerName,
    message,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getOrders() {
  const ordersSnapshot = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc")),
  );

  return ordersSnapshot.docs.map((orderDocument) => ({
    id: orderDocument.id,
    ...orderDocument.data(),
  }));
}

export async function getOrderById(id: string) {
  const orderDoc = await getDoc(doc(db, "orders", id));

  if (!orderDoc.exists()) {
    return null;
  }

  return {
    id: orderDoc.id,
    ...orderDoc.data(),
  };
}

export async function updateOrderStatus(
  id: string,
  status: "completed" | "cancelled",
) {
  await updateDoc(doc(db, "orders", id), {
    status,
    completedAt: serverTimestamp(),
  });
}

export async function getBarStatus() {
  const statusDoc = await getDoc(doc(db, "settings", "bar"));

  return statusDoc.exists() ? statusDoc.data().isOpen === true : true;
}

export async function setBarStatus(isOpen: boolean) {
  await setDoc(doc(db, "settings", "bar"), { isOpen }, { merge: true });
}

type SaveDrinkInput = {
  name: string;
  description: string;
  ingredients: string[];
  available: boolean;
  imageUrl: string;
};

export async function createDrink(drink: SaveDrinkInput) {
  await addDoc(collection(db, "drinks"), drink);
}

export async function updateDrink(id: string, drink: SaveDrinkInput) {
  await updateDoc(doc(db, "drinks", id), drink);
}

export async function setDrinkAvailability(id: string, available: boolean) {
  await updateDoc(doc(db, "drinks", id), { available });
}
