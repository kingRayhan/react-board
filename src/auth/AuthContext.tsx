import { IFirebaseUser } from "@/app/firebase/auth.firebase";
import { createContext, useContext, Context, PropsWithChildren } from "react";
import useFirebaseAuth from "./useFirebaseAuth";

interface IAuthContext {
  authUser: IFirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<IAuthContext>({
  authUser: null,
  loading: true,
});

export const FirebaseAuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useFirebaseAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthContext);
