import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  getAdditionalUserInfo,
  NextOrObserver,
} from "firebase/auth";
import { firebaseApp } from "./app.firebase";

const auth = getAuth(firebaseApp);
export type IFirebaseUser = User;

export const firebaseSignInWithEmailAndPassword = (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const firebaseSigninWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const firebaseLogout = () => {
  signOut(auth);
};

export const firebaseOnAuthStateChanged = (
  callback: NextOrObserver<IFirebaseUser>
) => {
  return onAuthStateChanged(auth, callback);
};
