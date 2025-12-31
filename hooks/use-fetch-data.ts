import { firestore } from "@/config/firebase";
import { UseFetchDataReturn } from "@/types";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

const useFetchData = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const constraintsKey = useMemo(
    () => JSON.stringify(constraints.map((c) => c.type)),
    [constraints]
  );

  useEffect(() => {
    if (!collectionName) return;

    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(fetchedData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, constraintsKey, constraints]);

  return { data, loading, error };
};

export default useFetchData;
