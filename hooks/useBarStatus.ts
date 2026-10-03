import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export default function useBarStatus() {
  const [isBarOpen, setIsBarOpen] = useState(false);

  useEffect(() => {
    return onSnapshot(
      doc(db, "settings", "bar"),
      (snapshot) => {
        setIsBarOpen(
          snapshot.exists() ? snapshot.data().isOpen === true : true,
        );
      },
      (error) => {
        console.error("Unable to load bar status:", error);
        setIsBarOpen(false);
      },
    );
  }, []);

  return isBarOpen;
}
