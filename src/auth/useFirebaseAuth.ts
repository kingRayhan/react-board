import {
  firebaseOnAuthStateChanged,
  IFirebaseUser,
} from "@/app/firebase/auth.firebase";
import { useEffect, useState } from "react";

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<IFirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged((authState) => {
      authState ? setAuthUser(authState) : setAuthUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}
