
export interface ResultsData {
  paperId: string;
  date: string;
  timeSpent: number;
  answers: Record<number, string>;
  questionStatus: Record<number, string>;
  correctOptions: Record<number, string>;
  score?: number;
  maxPossibleScore?: number;
}

export interface Question {
  id: number;
  text: string;
  imageUrl?: string;
  options: Array<{id: string, text: string}>;
  correctOption: string;
  subject: string;
  type: string;
}

// Scoring algorithm constants
export const CORRECT_MARKS = 4;
export const INCORRECT_MARKS = -1;
export const UNATTEMPTED_MARKS = 0;

// Freemium model constants
export const FREE_TEST_LIMIT = 1;

// API response types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface UserSubscription {
  active: boolean;
  plan: string;
  expiry?: string;
  features?: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | 'one-time';
  features: string[];
  popular?: boolean;
}

export interface PaperPurchase {
  paperId: string;
  purchaseDate: string;
  expiryDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription?: UserSubscription;
  purchasedPapers: PaperPurchase[];
  freeTestsUsed: number;
  freeTestsRemaining: number;
}
