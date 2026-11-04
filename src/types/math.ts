export type AllowedTableNumber = 1 | 2 | 3 | 4 | 5 | 6 | 10;

export const ALLOWED_TABLES: AllowedTableNumber[] = [1, 2, 3, 4, 5, 6, 10];

export interface TableItem {
  table: AllowedTableNumber;
  multiplier: number;
  result: number;
  explanation: string;
}

export interface TableInfo {
  number: AllowedTableNumber;
  title: string;
  themeColor: string;
  accentColor: string;
  iconName: string;
  trickTitle: string;
  trickDescription: string;
  example: string;
  realLifeExample: string;
  audioPhrase: string;
}

export interface MatchingCard {
  id: string;
  type: 'operation' | 'result';
  matchId: string;
  content: string;
  table: AllowedTableNumber;
  matched: boolean;
}

export interface TrueFalseQuestion {
  id: string;
  operationText: string;
  displayedResult: number;
  actualResult: number;
  isTrue: boolean;
  explanation: string;
  table: AllowedTableNumber;
}

export interface MultipleChoiceQuestion {
  id: string;
  operationText: string;
  a: AllowedTableNumber;
  b: number;
  correctAnswer: number;
  options: number[];
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
