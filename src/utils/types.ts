
export interface ResultsData {
  paperId: string;
  answers: Record<number, string>;
  questionStatus: Record<number, string>;
  timeSpent: number;
  date: string;
  score?: number;
  maxPossibleScore?: number;
}

export interface Question {
  id: number;
  text: string;
  options: Array<{id: string, text: string}>;
  correctOption: string;
  subject: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Scoring algorithm constants
export const CORRECT_MARKS = 4;
export const INCORRECT_MARKS = -1;
export const UNATTEMPTED_MARKS = 0;

// Freemium model constants
export const FREE_TEST_LIMIT = 1;

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

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
