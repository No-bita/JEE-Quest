
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
