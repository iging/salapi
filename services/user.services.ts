import { auth, firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { getPasswordChangeErrorMessage } from "@/utils/firebase-errors";
import { FirebaseError } from "firebase/app";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./image.services";

export const updateUser = async (
  uid: string,
  userData: UserDataType
): Promise<ResponseType> => {
  try {
    const dataToUpdate: Partial<UserDataType> = { name: userData.name };

    if (userData.image && userData.image.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        userData.image,
        "profiles"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };
      }

      dataToUpdate.image = imageUploadRes.data;
    }

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, dataToUpdate);

    return { success: true, msg: "Profile updated successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, msg: errorMessage };
  }
};

export const deleteUserAccount = async (uid: string): Promise<ResponseType> => {
  try {
    // Step 1: Delete all transactions for this user
    const transactionsRef = collection(firestore, "transactions");
    const transactionsQuery = query(transactionsRef, where("uid", "==", uid));
    const transactionsSnapshot = await getDocs(transactionsQuery);

    const deleteTransactionPromises = transactionsSnapshot.docs.map(
      (docSnapshot) => deleteDoc(doc(firestore, "transactions", docSnapshot.id))
    );
    await Promise.all(deleteTransactionPromises);

    // Step 2: Delete all wallets for this user
    const walletsRef = collection(firestore, "wallets");
    const walletsQuery = query(walletsRef, where("uid", "==", uid));
    const walletsSnapshot = await getDocs(walletsQuery);

    const deleteWalletPromises = walletsSnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(firestore, "wallets", docSnapshot.id))
    );
    await Promise.all(deleteWalletPromises);

    // Step 3: Delete user document from Firestore
    const userRef = doc(firestore, "users", uid);
    await deleteDoc(userRef);

    // Step 4: Delete Firebase Auth account
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
    }

    return {
      success: true,
      msg: "Account and all associated data deleted successfully",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete account";
    return { success: false, msg: errorMessage };
  }
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ResponseType> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      return { success: false, msg: "No user is currently signed in" };
    }

    // Re-authenticate the user with their current password
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(currentUser, credential);

    // Update to the new password
    await updatePassword(currentUser, newPassword);

    return { success: true, msg: "Password updated successfully" };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return { success: false, msg: getPasswordChangeErrorMessage(error.code) };
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to change password";
    return { success: false, msg: errorMessage };
  }
};

export type EmailVerificationResult = {
  exists: boolean;
  verified: boolean;
};

export const checkEmailVerificationStatus = async (
  email: string
): Promise<EmailVerificationResult> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Query Firestore directly - try both email formats for backward compatibility
    const usersRef = collection(firestore, "users");

    // Try lowercase first
    let q = query(usersRef, where("email", "==", normalizedEmail));
    let querySnapshot = await getDocs(q);

    // If not found, try original case
    if (querySnapshot.empty) {
      q = query(usersRef, where("email", "==", email.trim()));
      querySnapshot = await getDocs(q);
    }

    if (querySnapshot.empty) {
      return { exists: false, verified: false };
    }

    // Get the user document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Check if emailVerified field exists, default to false if not
    const isVerified = userData.emailVerified === true;

    return { exists: true, verified: isVerified };
  } catch {
    return { exists: false, verified: false };
  }
};
