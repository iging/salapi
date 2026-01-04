import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType } from "@/types";
import { toPeso } from "@/utils/currency";
import {
  cacheDirectory,
  EncodingType,
  moveAsync,
  writeAsStringAsync,
} from "expo-file-system/legacy";
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

// Generate CSV content
const generateCSVContent = (transactions: TransactionType[]): string => {
  const headers = ["Date", "Type", "Category", "Description", "Amount"];
  const rows = transactions.map((t) => {
    const date = moment(getDateFromTransaction(t.date)).format("YYYY-MM-DD");
    const type = t.type === "income" ? "Income" : "Expense";
    const category = t.customCategory || t.category || "Uncategorized";
    const description = t.description?.replace(/,/g, ";") || "-";
    const amount = t.amount.toFixed(2);

    return [date, type, category, description, amount].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};

// Generate professional PDF HTML template
const generatePDFTemplate = (
  transactions: TransactionType[],
  userName: string
): string => {
  const totals = calculateTotals(transactions);
  const generatedDate = moment().format("MMMM D, YYYY");
  const periodStart =
    transactions.length > 0
      ? moment(
          getDateFromTransaction(transactions[transactions.length - 1].date)
        ).format("MMM D, YYYY")
      : "-";
  const periodEnd =
    transactions.length > 0
      ? moment(getDateFromTransaction(transactions[0].date)).format(
          "MMM D, YYYY"
        )
      : "-";

  const transactionRows = transactions
    .map((t) => {
      const date = moment(getDateFromTransaction(t.date)).format("MMM D, YYYY");
      const category = escapeHtml(
        t.customCategory || t.category || "Uncategorized"
      );
      const description = escapeHtml(t.description || "-");
      const isIncome = t.type === "income";
      const amountColor = isIncome ? "#16a34a" : "#ef4444";
      const amountPrefix = isIncome ? "+" : "-";

      return `
        <tr>
          <td class="date-cell">${date}</td>
          <td class="category-cell">${category}</td>
          <td class="description-cell">${description}</td>
          <td class="amount-cell" style="color: ${amountColor};">
            ${amountPrefix}${toPeso(t.amount)}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Salapi Financial Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #000000;
          background-color: #ffffff;
          line-height: 1.5;
          padding: 40px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #000000;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .brand {
          display: flex;
          flex-direction: column;
        }
        
        .brand-name {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #000000;
        }
        
        .brand-tagline {
          font-size: 12px;
          color: #737373;
          margin-top: 4px;
        }
        
        .report-info {
          text-align: right;
        }
        
        .report-title {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .report-date {
          font-size: 12px;
          color: #737373;
          margin-top: 4px;
        }
        
        .report-user {
          font-size: 12px;
          color: #000000;
          margin-top: 2px;
        }
        
        .summary-section {
          background-color: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 30px;
        }
        
        .summary-title {
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          color: #737373;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }
        
        .summary-grid {
          display: flex;
          justify-content: space-between;
        }
        
        .summary-item {
          flex: 1;
          text-align: center;
          padding: 0 16px;
        }
        
        .summary-item:not(:last-child) {
          border-right: 1px solid #e5e5e5;
        }
        
        .summary-label {
          font-size: 11px;
          color: #737373;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .summary-value {
          font-size: 20px;
          font-weight: 700;
        }
        
        .summary-value.income {
          color: #16a34a;
        }
        
        .summary-value.expense {
          color: #ef4444;
        }
        
        .summary-value.balance {
          color: #000000;
        }
        
        .period-info {
          text-align: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
        }
        
        .period-text {
          font-size: 12px;
          color: #737373;
        }
        
        .transactions-section {
          margin-bottom: 30px;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .section-title {
          font-size: 11px;
          font-weight: 600;
          color: #737373;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .transaction-count {
          font-size: 12px;
          color: #737373;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        
        thead {
          background-color: #000000;
        }
        
        th {
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 12px 16px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        th:last-child {
          text-align: right;
        }
        
        tbody tr {
          border-bottom: 1px solid #e5e5e5;
        }
        
        tbody tr:hover {
          background-color: #fafafa;
        }
        
        td {
          padding: 14px 16px;
          vertical-align: middle;
        }
        
        .date-cell {
          color: #737373;
          font-size: 12px;
          white-space: nowrap;
        }
        
        .category-cell {
          font-weight: 500;
          color: #000000;
        }
        
        .description-cell {
          color: #737373;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .amount-cell {
          text-align: right;
          font-weight: 600;
          font-family: 'SF Mono', 'Menlo', monospace;
          white-space: nowrap;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
        }
        
        .footer-text {
          font-size: 10px;
          color: #a3a3a3;
        }
        
        .footer-brand {
          font-weight: 600;
          color: #737373;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #737373;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .header {
            margin-bottom: 20px;
          }
          
          .summary-section {
            margin-bottom: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <div class="brand-name">Salapi</div>
          <div class="brand-tagline">Personal Finance Manager</div>
        </div>
        <div class="report-info">
          <div class="report-title">Financial Report</div>
          <div class="report-date">Generated: ${generatedDate}</div>
          <div class="report-user">${escapeHtml(userName)}</div>
        </div>
      </div>
      
      <div class="summary-section">
        <div class="summary-title">Financial Summary</div>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Income</div>
            <div class="summary-value income">${toPeso(
              totals.totalIncome
            )}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Expenses</div>
            <div class="summary-value expense">${toPeso(
              totals.totalExpense
            )}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Net Balance</div>
            <div class="summary-value balance">${toPeso(
              totals.netBalance
            )}</div>
          </div>
        </div>
        <div class="period-info">
          <span class="period-text">Report Period: ${periodStart} - ${periodEnd}</span>
        </div>
      </div>
      
      <div class="transactions-section">
        <div class="section-header">
          <div class="section-title">Transaction History</div>
          <div class="transaction-count">${
            transactions.length
          } transactions</div>
        </div>
        
        ${
          transactions.length > 0
            ? `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactionRows}
            </tbody>
          </table>
        `
            : `
          <div class="empty-state">
            No transactions found for this period.
          </div>
        `
        }
      </div>
      
      <div class="footer">
        <div class="footer-text">
          This report was automatically generated by <span class="footer-brand">Salapi</span>.
          <br>
          For questions or support, please contact us through the app.
        </div>
      </div>
    </body>
    </html>
  `;
};

// Export transactions to CSV file
export const exportToCSV = async (
  uid: string
): Promise<ResponseType & { filePath?: string }> => {
  try {
    const result = await fetchAllTransactions(uid);

    if (!result.success || !result.data) {
      return { success: false, msg: result.msg || "Failed to fetch data" };
    }

    if (result.data.length === 0) {
      return { success: false, msg: "No transactions to export" };
    }

    const csvContent = generateCSVContent(result.data);
    const fileName = `salapi_transactions_${moment().format("YYYY-MM-DD")}.csv`;
    const filePath = `${cacheDirectory}${fileName}`;

    await writeAsStringAsync(filePath, csvContent, {
      encoding: EncodingType.UTF8,
    });

    // Check if sharing is available
    const sharingAvailable = await isAvailableAsync();
    if (sharingAvailable) {
      await shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "Export Transactions",
        UTI: "public.comma-separated-values-text",
      });
    }

    return {
      success: true,
      msg: "CSV exported successfully",
      filePath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export CSV";
    return { success: false, msg: errorMessage };
  }
};

// Export transactions to CSV file with date range
export const exportToCSVWithDateRange = async (
  uid: string,
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

    const csvContent = generateCSVContent(filteredData);
    const startStr = moment(periodStart).format("YYYY-MM-DD");
    const endStr = moment(periodEnd).format("YYYY-MM-DD");
    const fileName = `salapi_transactions_${startStr}_to_${endStr}.csv`;
    const filePath = `${cacheDirectory}${fileName}`;

    await writeAsStringAsync(filePath, csvContent, {
      encoding: EncodingType.UTF8,
    });

    const sharingAvailable = await isAvailableAsync();
    if (sharingAvailable) {
      await shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "Export Transactions",
        UTI: "public.comma-separated-values-text",
      });
    }

    return {
      success: true,
      msg: "CSV exported successfully",
      filePath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export CSV";
    return { success: false, msg: errorMessage };
  }
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

    // Generate PDF from HTML
    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Rename file with proper name
    const fileName = `salapi_report_${moment().format("YYYY-MM-DD")}.pdf`;
    const newPath = `${cacheDirectory}${fileName}`;

    await moveAsync({
      from: uri,
      to: newPath,
    });

    // Check if sharing is available
    const sharingAvailable = await isAvailableAsync();
    if (sharingAvailable) {
      await shareAsync(newPath, {
        mimeType: "application/pdf",
        dialogTitle: "Export Financial Report",
        UTI: "com.adobe.pdf",
      });
    }

    return {
      success: true,
      msg: "PDF exported successfully",
      filePath: newPath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export PDF";
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

    const htmlContent = generatePDFTemplate(filteredData, userName);

    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    const startStr = moment(periodStart).format("YYYY-MM-DD");
    const endStr = moment(periodEnd).format("YYYY-MM-DD");
    const fileName = `salapi_report_${startStr}_to_${endStr}.pdf`;
    const newPath = `${cacheDirectory}${fileName}`;

    await moveAsync({
      from: uri,
      to: newPath,
    });

    const sharingAvailable = await isAvailableAsync();
    if (sharingAvailable) {
      await shareAsync(newPath, {
        mimeType: "application/pdf",
        dialogTitle: "Export Financial Report",
        UTI: "com.adobe.pdf",
      });
    }

    return {
      success: true,
      msg: "PDF exported successfully",
      filePath: newPath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to export PDF";
    return { success: false, msg: errorMessage };
  }
};
