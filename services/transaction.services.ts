import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType } from "@/types";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { uploadFileToCloudinary } from "./image.services";

const getDateFromTransaction = (date: string | Date | Timestamp): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
};

const updateWalletBalance = async (
  walletId: string,
  amount: number,
  type: string,
  isReversal: boolean = false
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);

    // Check if wallet exists before updating
    const walletDoc = await getDoc(walletRef);
    if (!walletDoc.exists()) {
      console.warn(`Wallet ${walletId} not found, skipping balance update`);
      return;
    }

    const multiplier = isReversal ? -1 : 1;

    if (type === "income") {
      await updateDoc(walletRef, {
        amount: increment(amount * multiplier),
        totalIncome: increment(amount * multiplier),
      });
    } else {
      await updateDoc(walletRef, {
        amount: increment(-amount * multiplier),
        totalExpenses: increment(amount * multiplier),
      });
    }
  } catch (error) {
    console.error("Failed to update wallet balance:", error);
  }
};

export const createTransaction = async (
  uid: string,
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    let imageUrl = null;

    if (transactionData.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        transactionData.image,
        "transactions"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };
      }

      imageUrl = imageUploadRes.data;
    }

    const transactionRef = collection(firestore, "transactions");
    await addDoc(transactionRef, {
      ...transactionData,
      image: imageUrl,
      uid,
      created: serverTimestamp(),
    });

    // Update wallet balance
    if (
      transactionData.walletId &&
      transactionData.amount &&
      transactionData.type
    ) {
      await updateWalletBalance(
        transactionData.walletId,
        transactionData.amount,
        transactionData.type
      );
    }

    return {
      success: true,
      msg: "Transaction created successfully",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create transaction";
    return { success: false, msg: errorMessage };
  }
};

export const updateTransaction = async (
  transactionId: string,
  transactionData: Partial<TransactionType>,
  oldTransaction?: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const dataToUpdate: Partial<TransactionType> = { ...transactionData };

    if (transactionData.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        transactionData.image,
        "transactions"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };
      }

      dataToUpdate.image = imageUploadRes.data;
    }

    const transactionRef = doc(firestore, "transactions", transactionId);

    // If old transaction data is provided, reverse the old balance and apply new
    if (
      oldTransaction?.walletId &&
      oldTransaction?.amount &&
      oldTransaction?.type
    ) {
      // Reverse old transaction effect
      await updateWalletBalance(
        oldTransaction.walletId,
        oldTransaction.amount,
        oldTransaction.type,
        true // isReversal
      );
    }

    // Apply new transaction effect
    if (
      transactionData.walletId &&
      transactionData.amount &&
      transactionData.type
    ) {
      await updateWalletBalance(
        transactionData.walletId,
        transactionData.amount,
        transactionData.type
      );
    }

    await updateDoc(transactionRef, dataToUpdate);

    return { success: true, msg: "Transaction updated successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update transaction";
    return { success: false, msg: errorMessage };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId?: string,
  amount?: number,
  type?: string
): Promise<ResponseType> => {
  try {
    // Reverse the transaction effect on wallet
    if (walletId && amount && type) {
      await updateWalletBalance(walletId, amount, type, true);
    }

    const transactionRef = doc(firestore, "transactions", transactionId);
    await deleteDoc(transactionRef);

    return { success: true, msg: "Transaction deleted successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete transaction";
    return { success: false, msg: errorMessage };
  }
};

export const fetchWeeklyStats = async (uid: string) => {
  try {
    const transactionsRef = collection(firestore, "transactions");
    const sevenDaysAgo = moment().subtract(6, "days").startOf("day");

    // Simple query - filter by uid only, then filter dates client-side
    const q = query(transactionsRef, where("uid", "==", uid));

    const snapshot = await getDocs(q);
    const allTransactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TransactionType[];

    const transactions = allTransactions.filter((t) => {
      const transactionDate = moment(getDateFromTransaction(t.date));
      return transactionDate.isSameOrAfter(sevenDaysAgo, "day");
    });

    const weeklyData = getLast7Days();

    transactions.forEach((transaction) => {
      const transactionDate = moment(
        getDateFromTransaction(transaction.date)
      ).format("MM-DD-YYYY");

      const dayData = weeklyData.find((d) => d.date === transactionDate);
      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount || 0;
        } else {
          dayData.expense += transaction.amount || 0;
        }
      }
    });

    return { success: true, data: weeklyData };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch weekly stats";
    return { success: false, msg: errorMessage, data: [] };
  }
};

export const fetchMonthlyStats = async (uid: string) => {
  try {
    const transactionsRef = collection(firestore, "transactions");
    const twelveMonthsAgo = moment().subtract(11, "months").startOf("month");

    // Simple query - filter by uid only, then filter dates client-side
    const q = query(transactionsRef, where("uid", "==", uid));

    const snapshot = await getDocs(q);
    const allTransactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TransactionType[];

    const transactions = allTransactions.filter((t) => {
      const transactionDate = moment(getDateFromTransaction(t.date));
      return transactionDate.isSameOrAfter(twelveMonthsAgo, "month");
    });

    const monthlyData = getLast12Months();

    transactions.forEach((transaction) => {
      const transactionMonthYear = moment(
        getDateFromTransaction(transaction.date)
      ).format("MMM YY");

      const monthData = monthlyData.find(
        (m) => m.month === transactionMonthYear
      );
      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount || 0;
        } else {
          monthData.expense += transaction.amount || 0;
        }
      }
    });

    return { success: true, data: monthlyData };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch monthly stats";
    return { success: false, msg: errorMessage, data: [] };
  }
};

export const fetchYearlyStats = async (uid: string) => {
  try {
    const transactionsRef = collection(firestore, "transactions");
    const currentYear = moment().year();
    const startYear = currentYear - 4;
    const fiveYearsAgo = moment(`${startYear}-01-01`).startOf("year");

    // Simple query - filter by uid only, then filter dates client-side
    const q = query(transactionsRef, where("uid", "==", uid));

    const snapshot = await getDocs(q);
    const allTransactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TransactionType[];

    const transactions = allTransactions.filter((t) => {
      const transactionDate = moment(getDateFromTransaction(t.date));
      return transactionDate.isSameOrAfter(fiveYearsAgo, "year");
    });

    const yearlyData = getYearsRange(startYear, currentYear);

    transactions.forEach((transaction) => {
      const transactionYear = moment(
        getDateFromTransaction(transaction.date)
      ).format("YYYY");

      const yearData = yearlyData.find((y) => y.year === transactionYear);
      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount || 0;
        } else {
          yearData.expense += transaction.amount || 0;
        }
      }
    });

    return { success: true, data: yearlyData };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch yearly stats";
    return { success: false, msg: errorMessage, data: [] };
  }
};
