/** Product rows of the V3 exec page (B7 §1 E1.6), shared by server pages and client components. */
import type { ProductId } from "./types";

export const PRODUCT_ORDER: ProductId[] = [
  "everyday_accounts_app",
  "payments_swish",
  "cards",
  "mortgages",
  "savings_funds",
  "consumer_loans",
];

/** Products with a full module (M1–M3); the rest open the business view. */
export const MODULES: Partial<Record<ProductId, string>> = {
  everyday_accounts_app: "everyday_accounts_app",
  digital: "nina_digital",
};

/**
 * Deliverables in each product's remit (review finding #18). Items tagged to a product by theme can carry another
 * product's deliverable (a card query under Everyday accounts and app); those are grouped as "Other service standards" on the
 * business view, so every row the product head sees is theirs and the total still reconciles.
 */
const ALL_PRODUCTS: ProductId[] = PRODUCT_ORDER;
const LOANS: ProductId[] = ["consumer_loans", "mortgages"];
export const DELIVERABLE_REMIT: Record<string, ProductId[]> = {
  failed_reversal: ["payments_swish", "everyday_accounts_app"],
  unauthorised_reversal: ["payments_swish", "cards", "everyday_accounts_app"],
  manipulated_transfer: ["payments_swish"],
  account_unfreeze: ["everyday_accounts_app", "payments_swish"],
  dispute: ["cards", "payments_swish"],
  refund: ["cards", "payments_swish"],
  card_dispatch: ["cards"],
  card_closure: ["cards"],
  credit_report: LOANS,
  loan_documents: LOANS,
  loan_disbursal: LOANS,
  complaint_resolution: ALL_PRODUCTS,
  service_request: ALL_PRODUCTS,
  query_response: ALL_PRODUCTS,
};
