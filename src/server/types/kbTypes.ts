export type TSCCategory =
  | "Security"
  | "Availability"
  | "Confidentiality"
  | "Processing Integrity"
  | "Privacy";

export interface TSCCriterion {
  id: string; // e.g., CC6.1
  category: TSCCategory;
  title: string;
  requirement: string;
  keywords: string[];
  embedding?: number[];
}
