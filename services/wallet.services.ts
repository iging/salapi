import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./image.services";

export const createWallet = async (
  uid: string,
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let imageUrl = null;

    if (walletData.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };
      }

      imageUrl = imageUploadRes.data;
    }

    const walletRef = collection(firestore, "wallets");
    const newWallet = await addDoc(walletRef, {
      name: walletData.name,
      amount: walletData.amount || 0,
      totalIncome: 0,
      totalExpenses: 0,
      image: imageUrl,
      uid,
      created: serverTimestamp(),
    });

    return {
      success: true,
      data: { id: newWallet.id },
      msg: "Wallet created successfully",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create wallet";
    return { success: false, msg: errorMessage };
  }
};

export const updateWallet = async (
  walletId: string,
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    const dataToUpdate: Partial<WalletType> = { name: walletData.name };

    if (walletData.amount !== undefined) {
      dataToUpdate.amount = walletData.amount;
    }

    if (walletData.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };
      }

      dataToUpdate.image = imageUploadRes.data;
    }

    const walletRef = doc(firestore, "wallets", walletId);
    await updateDoc(walletRef, dataToUpdate);

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update wallet";
    return { success: false, msg: errorMessage };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    // Delete all transactions associated with this wallet
    const transactionsRef = collection(firestore, "transactions");
    const q = query(transactionsRef, where("walletId", "==", walletId));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(firestore, "transactions", docSnapshot.id))
    );
    await Promise.all(deletePromises);

    // Delete the wallet
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    return {
      success: true,
      msg: `Wallet and ${querySnapshot.size} transaction(s) deleted successfully`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete wallet";
    return { success: false, msg: errorMessage };
  }
};
