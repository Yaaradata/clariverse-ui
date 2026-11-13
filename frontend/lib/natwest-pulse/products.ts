/** Product rows of the V3 exec page (B7 §1 E1.6), shared by server pages and client components. */
import type { ProductId } from "./types";

export const PRODUCT_ORDER: ProductId[] = [
  "current_accounts",
  "payments_fraud",
  "cards",
  "savings",
  "mortgages",
  "personal_loans",
];

/** Products with a full module (M1–M3); the rest open the business view. */
export const MODULES: Partial<Record<ProductId, string>> = {
  cards: "cards",
  digital: "cora_digital",
};

/**
 * Deliverables in each product's remit (review finding #18). Items tagged to a product by theme can carry another
 * product's deliverable (a loan-on-card query under Credit cards); those are grouped as "Other deliverables" on the
 * business view, so every row the product head sees is theirs and the total still reconciles.
 */
const ALL_PRODUCTS: ProductId[] = PRODUCT_ORDER;
const LOANS: ProductId[] = ["personal_loans", "mortgages"];
export const DELIVERABLE_REMIT: Record<string, ProductId[]> = {
  failed_reversal: ["cards", "payments_fraud", "current_accounts"],
  card_closure: ["cards"],
  unauthorised_reversal: ["cards", "payments_fraud", "current_accounts"],
  credit_report: ["cards", ...LOANS],
  loan_documents: LOANS,
  complaint_resolution: ALL_PRODUCTS,
  card_dispatch: ["cards"],
  dispute: ["cards", "payments_fraud"],
  refund: ["cards", "payments_fraud"],
  service_request: ALL_PRODUCTS,
  account_unfreeze: ["current_accounts", "payments_fraud"],
  loan_disbursal: LOANS,
  query_response: ALL_PRODUCTS,
};
