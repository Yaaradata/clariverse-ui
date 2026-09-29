/** Product rows of the V3 exec page (B7 §1 E1.6), shared by server pages and client components. */
import type { ProductId } from "./types";

export const PRODUCT_ORDER: ProductId[] = [
  "cards",
  "payzapp",
  "accounts",
  "personal_loans",
  "home_loans",
  "auto_loans",
  "insurance",
  "digital",
];

/** Products with a full module (M1–M3); the rest open the business view. */
export const MODULES: Partial<Record<ProductId, string>> = {
  cards: "cards",
  digital: "digital",
};
