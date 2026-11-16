import {
  addDoc,
  type DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { getCustomerId } from "./customer";

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
  const customerId = await getCustomerId();
  const counterReference = doc(db, "settings", "order-counter");
  const orderReference = doc(collection(db, "orders"));

  await runTransaction(db, async (transaction) => {
    const barSnapshot = await transaction.get(doc(db, "settings", "bar"));
    if (barSnapshot.exists() && barSnapshot.data().isOpen !== true) {
      throw new Error("The bar is closed.");
    }

    const counterSnapshot = await transaction.get(counterReference);
    const orderNumber = (counterSnapshot.data()?.lastOrderNumber ?? 0) + 1;

    transaction.set(
      counterReference,
      { lastOrderNumber: orderNumber },
      { merge: true },
    );
    transaction.set(orderReference, {
      drinkId,
      drinkName,
      customerName,
      customerId,
      message,
      orderNumber,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  });
}

export async function getOrders(direction: "asc" | "desc" = "desc") {
  const ordersSnapshot = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", direction)),
  );

  return ordersSnapshot.docs.map((orderDocument) => ({
    id: orderDocument.id,
    ...orderDocument.data(),
  }));
}

export async function getMyOrders() {
  const customerId = await getCustomerId();
  const ordersSnapshot = await getDocs(
    query(collection(db, "orders"), where("customerId", "==", customerId)),
  );

  // Sorted client-side to avoid requiring a composite Firestore index.
  // Orders whose server timestamp is still pending count as newest.
  const createdAtMillis = (order: DocumentData) =>
    order.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;

  return ordersSnapshot.docs
    .map((orderDocument) => ({
      id: orderDocument.id,
      ...orderDocument.data(),
    }))
    .sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
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
