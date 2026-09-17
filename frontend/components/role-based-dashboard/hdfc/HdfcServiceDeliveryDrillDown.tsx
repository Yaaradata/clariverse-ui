"use client";

/**
 * HDFC Head of CX — "Can the engine deliver?" (drill 2 / tile 3).
 *
 * Same layout as retail "How is our Service delivery?" with India / RBI copy
 * (`variant="hdfc"`).
 *
 * Route: /role-based/hdfc/head_of_cx
 */
import { ServiceFulfilmentDrillDown } from "../RetailDrillDownScreens";

type Props = {
  onBack: () => void;
};

export default function HdfcServiceDeliveryDrillDown({ onBack }: Props) {
  return <ServiceFulfilmentDrillDown onBack={onBack} variant="hdfc" />;
}
