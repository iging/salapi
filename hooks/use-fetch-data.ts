import { firestore } from "@/config/firebase";
import { UseFetchDataReturn } from "@/types";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

const useFetchData = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const constraintsKey = useMemo(
    () => JSON.stringify(constraints.map((c) => c.type)),
    [constraints]
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    // Trigger re-subscription by changing the key
    setRefreshKey((prev) => prev + 1);
    // Small delay to show skeleton
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!collectionName) return;

    setLoading(true);
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
  }, [collectionName, constraintsKey, constraints, refreshKey]);

  return { data, loading, error, refreshing, refresh };
};

export default useFetchData;
