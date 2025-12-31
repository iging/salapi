import { z } from "zod";

export const walletSchema = z.object({
  name: z
    .string()
    .min(1, "Wallet name is required")
    .max(50, "Wallet name is too long"),
});

export type WalletFormData = z.infer<typeof walletSchema>;
