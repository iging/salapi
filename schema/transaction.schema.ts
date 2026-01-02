import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    message: "Transaction type is required",
  }),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  category: z.string().optional(),
  customCategory: z.string().max(50, "Custom category is too long").optional(),
  date: z.date({ message: "Date is required" }),
  description: z.string().max(200, "Description is too long").optional(),
  walletId: z.string().min(1, "Please select a wallet"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
