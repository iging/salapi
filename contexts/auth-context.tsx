import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { getAuthErrorMessage } from "@/utils/firebase-errors";
import Constants from "expo-constants";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const SUPER_ACCOUNT_UID = Constants.expoConfig?.extra?.superAccountUid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Super account bypass only allowed in development mode
        const isSuperAccount =
          __DEV__ && firebaseUser.uid === SUPER_ACCOUNT_UID;

        if (firebaseUser.emailVerified || isSuperAccount) {
          await updateUserData(firebaseUser.uid);
          setLoading(false);
        } else {
          await signOut(auth);
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [SUPER_ACCOUNT_UID]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Skip email verification for super account (only in development mode)
      const isSuperAccount = __DEV__ && result.user.uid === SUPER_ACCOUNT_UID;

      if (!result.user.emailVerified && !isSuperAccount) {
        await signOut(auth);
        return {
          success: false,
          msg: "Please verify your email before logging in. Check your inbox.",
        };
      }

      // Update emailVerified status in Firestore if verified
      if (result.user.emailVerified) {
        const userRef = doc(firestore, "users", result.user.uid);
        await updateDoc(userRef, { emailVerified: true });
      }

      return { success: true };
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return { success: false, msg: getAuthErrorMessage(firebaseError.code) };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, msg: "Passwords do not match" };
      }

      // Server-side password validation
      if (password.length < 6) {
        return {
          success: false,
          msg: "Password must be at least 6 characters",
        };
      }
      if (!/[A-Z]/.test(password)) {
        return {
          success: false,
          msg: "Password must contain an uppercase letter",
        };
      }
      if (!/[a-z]/.test(password)) {
        return {
          success: false,
          msg: "Password must contain a lowercase letter",
        };
      }
      if (!/[0-9]/.test(password)) {
        return { success: false, msg: "Password must contain a number" };
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
          success: false,
          msg: "Password must contain a special character",
        };
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(result.user);

      await setDoc(doc(firestore, "users", result.user.uid), {
        name,
        email: email.toLowerCase().trim(),
        uid: result.user.uid,
        emailVerified: false,
      });

      await signOut(auth);

      return {
        success: true,
        msg: "Account created! Please check your email to verify your account.",
      };
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return { success: false, msg: getAuthErrorMessage(firebaseError.code) };
    }
  };

  const updateUserData = async (userId: string) => {
    try {
      const docRef = doc(firestore, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({
          uid: userId,
          email: data.email,
          name: data.name,
          image: data.image,
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      if (__DEV__) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        updateUserData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
