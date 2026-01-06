import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType } from "@/types";
import { toPeso } from "@/utils/currency";
import { cacheDirectory, moveAsync } from "expo-file-system/legacy";
import { printToFileAsync } from "expo-print";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import moment from "moment";

// HTML escape function to prevent XSS in PDF generation
const escapeHtml = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Helper to convert Firestore date to JS Date
const getDateFromTransaction = (date: string | Date | Timestamp): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
};

// Export the helper for use in other components
export { getDateFromTransaction };

// Get the date range boundaries from all transactions
export const getTransactionDateRange = async (
  uid: string
): Promise<
  ResponseType & { minDate?: Date; maxDate?: Date; hasTransactions: boolean }
> => {
  try {
    const result = await fetchAllTransactions(uid);

    if (!result.success || !result.data || result.data.length === 0) {
      return { success: true, hasTransactions: false };
    }

    const dates: Date[] = result.data.map((t: TransactionType) =>
      getDateFromTransaction(t.date)
    );
    const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));

    return {
      success: true,
      minDate,
      maxDate,
      hasTransactions: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get date range";
    return { success: false, msg: errorMessage, hasTransactions: false };
  }
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: TransactionType[],
  periodStart: Date,
  periodEnd: Date
): TransactionType[] => {
  const startOfDay = new Date(periodStart);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(periodEnd);
  endOfDay.setHours(23, 59, 59, 999);

  return transactions.filter((t) => {
    const transactionDate = getDateFromTransaction(t.date);
    return transactionDate >= startOfDay && transactionDate <= endOfDay;
  });
};

// Check if transactions exist in date range
export const hasTransactionsInRange = async (
  uid: string,
  periodStart: Date,
  periodEnd: Date
): Promise<{ exists: boolean; count: number }> => {
  const result = await fetchAllTransactions(uid);

  if (!result.success || !result.data) {
    return { exists: false, count: 0 };
  }

  const filtered = filterTransactionsByDateRange(
    result.data,
    periodStart,
    periodEnd
  );
  return { exists: filtered.length > 0, count: filtered.length };
};

// Fetch all user transactions
export const fetchAllTransactions = async (
  uid: string
): Promise<ResponseType & { data?: TransactionType[] }> => {
  try {
    const transactionsRef = collection(firestore, "transactions");
    const q = query(transactionsRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TransactionType[];

    // Sort by date descending
    transactions.sort((a, b) => {
      const dateA = getDateFromTransaction(a.date);
      const dateB = getDateFromTransaction(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return { success: true, data: transactions };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch transactions";
    return { success: false, msg: errorMessage };
  }
};

// Calculate totals from transactions
const calculateTotals = (transactions: TransactionType[]) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount || 0;
    } else {
      totalExpense += t.amount || 0;
    }
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

// Generate professional bank statement style PDF HTML template
const generatePDFTemplate = (
  transactions: TransactionType[],
  userName: string,
  periodStart?: Date,
  periodEnd?: Date
): string => {
  const totals = calculateTotals(transactions);
  const generatedDate = moment().format("MMMM D, YYYY");

  // Use provided dates or calculate from transactions
  const startDate = periodStart
    ? moment(periodStart).format("MMMM D, YYYY")
    : transactions.length > 0
    ? moment(
        getDateFromTransaction(transactions[transactions.length - 1].date)
      ).format("MMMM D, YYYY")
    : "-";
  const endDate = periodEnd
    ? moment(periodEnd).format("MMMM D, YYYY")
    : transactions.length > 0
    ? moment(getDateFromTransaction(transactions[0].date)).format(
        "MMMM D, YYYY"
      )
    : "-";

  const transactionRows = transactions
    .map((t) => {
      const date = moment(getDateFromTransaction(t.date)).format("MM/DD/YYYY");
      const category = escapeHtml(
        t.customCategory || t.category || "Uncategorized"
      );
      const description = escapeHtml(t.description || "-");
      const isIncome = t.type === "income";

      return `
        <tr>
          <td>${date}</td>
          <td>${category}</td>
          <td>${description}</td>
          <td class="amount ${isIncome ? "credit" : "debit"}">
            ${isIncome ? "" : "-"}${toPeso(t.amount)}
          </td>
        </tr>
      `;
    })
    .join("");

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salapi Statement</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; background: #fff; line-height: 1.4; }
    .page { padding: 40px 50px; max-width: 8.5in; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #000; margin-bottom: 25px; }
    .logo-section { display: flex; flex-direction: column; }
    .logo { font-size: 28pt; font-weight: bold; color: #000; letter-spacing: -1px; }
    .tagline { font-size: 8pt; color: #666; margin-top: 2px; }
    .statement-info { text-align: right; }
    .statement-title { font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .statement-date { font-size: 9pt; color: #444; }
    .account-section { display: flex; justify-content: space-between; margin-bottom: 25px; padding: 15px 20px; background: #f8f8f8; border: 1px solid #e0e0e0; }
    .account-holder { flex: 1; }
    .account-label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .account-value { font-size: 11pt; font-weight: 600; color: #000; }
    .statement-period { text-align: right; }
    .summary-section { margin-bottom: 30px; }
    .summary-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px; border-bottom: 1px solid #ccc; margin-bottom: 15px; }
    .summary-grid { display: flex; justify-content: space-between; }
    .summary-item { flex: 1; text-align: center; padding: 15px 10px; border: 1px solid #e0e0e0; margin: 0 5px; }
    .summary-item:first-child { margin-left: 0; }
    .summary-item:last-child { margin-right: 0; }
    .summary-label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .summary-value { font-size: 14pt; font-weight: bold; }
    .summary-value.income { color: #16a34a; }
    .summary-value.expense { color: #dc2626; }
    .summary-value.balance { color: #000; }
    .transactions-section { margin-bottom: 30px; }
    .transactions-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px; border-bottom: 1px solid #ccc; margin-bottom: 0; }
    table { width: 100%; border-collapse: collapse; font-size: 9pt; }
    thead { background: #f0f0f0; }
    th { text-align: left; padding: 10px 12px; font-weight: 600; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #000; }
    th:last-child { text-align: right; }
    td { padding: 10px 12px; border-bottom: 1px solid #e5e5e5; vertical-align: top; }
    tr:nth-child(even) { background: #fafafa; }
    .amount { text-align: right; font-family: 'Courier New', monospace; font-weight: 600; white-space: nowrap; }
    .amount.credit { color: #16a34a; }
    .amount.debit { color: #dc2626; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; }
    .footer-text { font-size: 8pt; color: #888; }
    .footer-brand { font-weight: 600; color: #666; }
    .empty-state { text-align: center; padding: 40px; color: #666; font-style: italic; }
    @media print { .page { padding: 20px 30px; } body { font-size: 9pt; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-section">
        <div class="logo">Salapi</div>
        <div class="tagline">Personal Finance Manager</div>
      </div>
      <div class="statement-info">
        <div class="statement-title">Account Statement</div>
        <div class="statement-date">Generated: ${generatedDate}</div>
      </div>
    </div>
    <div class="account-section">
      <div class="account-holder">
        <div class="account-label">Account Holder</div>
        <div class="account-value">${escapeHtml(userName)}</div>
      </div>
      <div class="statement-period">
        <div class="account-label">Statement Period</div>
        <div class="account-value">${startDate} - ${endDate}</div>
      </div>
    </div>
    <div class="summary-section">
      <div class="summary-title">Account Summary</div>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Total Credits</div>
          <div class="summary-value income">${toPeso(totals.totalIncome)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Total Debits</div>
          <div class="summary-value expense">${toPeso(
            totals.totalExpense
          )}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Net Balance</div>
          <div class="summary-value balance">${toPeso(totals.netBalance)}</div>
        </div>
      </div>
    </div>
    <div class="transactions-section">
      <div class="transactions-title">Transaction Details (${
        transactions.length
      } transactions)</div>
      ${
        transactions.length > 0
          ? `<table>
        <thead>
          <tr>
            <th style="width: 15%;">Date</th>
            <th style="width: 25%;">Category</th>
            <th style="width: 40%;">Description</th>
            <th style="width: 20%;">Amount</th>
          </tr>
        </thead>
        <tbody>${transactionRows}</tbody>
      </table>`
          : `<div class="empty-state">No transactions found for this period.</div>`
      }
    </div>
    <div class="footer">
      <div class="footer-text">
        This statement was automatically generated by <span class="footer-brand">Salapi</span>.<br>
        For questions or support, please contact us through the app.
      </div>
    </div>
  </div>
</body>
</html>`;

  return htmlContent;
};

// Export transactions to PDF file
export const exportToPDF = async (
  uid: string,
  userName: string
): Promise<ResponseType & { filePath?: string }> => {
  try {
    const result = await fetchAllTransactions(uid);

    if (!result.success || !result.data) {
      return { success: false, msg: result.msg || "Failed to fetch data" };
    }

    const htmlContent = generatePDFTemplate(result.data, userName);

    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    const fileName = `salapi_statement_${moment().format("YYYY-MM-DD")}.pdf`;
    const newPath = `${cacheDirectory}${fileName}`;

    await moveAsync({
      from: uri,
      to: newPath,
    });

    const sharingAvailable = await isAvailableAsync();
    if (sharingAvailable) {
      await shareAsync(newPath, {
        mimeType: "application/pdf",
        dialogTitle: "Export Statement",
        UTI: "com.adobe.pdf",
      });
    }

    return {
      success: true,
      msg: "Statement exported successfully",
      filePath: newPath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export statement";
    return { success: false, msg: errorMessage };
  }
};

// Export transactions to PDF file with date range
export const exportToPDFWithDateRange = async (
  uid: string,
  userName: string,
  periodStart: Date,
  periodEnd: Date
): Promise<ResponseType & { filePath?: string }> => {
  try {
    const result = await fetchAllTransactions(uid);

    if (!result.success || !result.data) {
      return { success: false, msg: result.msg || "Failed to fetch data" };
    }

    const filteredData = filterTransactionsByDateRange(
      result.data,
      periodStart,
      periodEnd
    );

    if (filteredData.length === 0) {
      return {
        success: false,
        msg: "No data available for the selected period.",
      };
    }

    const htmlContent = generatePDFTemplate(
      filteredData,
      userName,
      periodStart,
      periodEnd
    );

    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    const startStr = moment(periodStart).format("YYYY-MM-DD");
    const endStr = moment(periodEnd).format("YYYY-MM-DD");
    const fileName = `salapi_statement_${startStr}_to_${endStr}.pdf`;
    const newPath = `${cacheDirectory}${fileName}`;

    await moveAsync({
      from: uri,
      to: newPath,
    });

    const sharingAvailable = await isAvailableAsync();
    if (sharingAvailable) {
      await shareAsync(newPath, {
        mimeType: "application/pdf",
        dialogTitle: "Export Statement",
        UTI: "com.adobe.pdf",
      });
    }

    return {
      success: true,
      msg: "Statement exported successfully",
      filePath: newPath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export statement";
    return { success: false, msg: errorMessage };
  }
};
