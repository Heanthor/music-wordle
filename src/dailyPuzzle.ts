import { ComposerWork } from "./composerWork";

export type PuzzleCategory = "Piano" | "Violin" | "Cello" | "Orchestral";

export type Difficulty = "Easy" | "Medium" | "Hard";

export const puzzleCategories: PuzzleCategory[] = [
  "Piano",
  "Violin",
  "Cello",
  "Orchestral",
];

export const getCategoryAbbreviation = (category: PuzzleCategory): string => {
  return category[0].toUpperCase();
};

export const parseCategoryFromAbbreviation = (abbr: string): PuzzleCategory => {
  switch (abbr) {
    case "P":
      return "Piano";
    case "V":
      return "Violin";
    case "C":
      return "Cello";
    case "O":
      return "Orchestral";
    default:
      return "Piano";
  }
};

export const difficultyStrFromNumber = (difficulty: number): Difficulty => {
  switch (difficulty) {
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    default:
      return "Easy";
  }
};

export class DailyPuzzle {
  puzzleDate: Date;
  puzzleNumber: number;
  isLatestPuzzle: boolean;
  puzzleAnswer: ComposerWork;
  sheetSource: string;
  puzzleCategory: PuzzleCategory;
  puzzleId: number;
  difficulty: number;

  constructor(
    puzzleDate: Date,
    puzzleNumber: number,
    isLatestPuzzle: boolean,
    puzzleAnswer: ComposerWork,
    sheetSource: string,
    puzzleCategory: PuzzleCategory,
    puzzleId: number,
    difficulty: number
  ) {
    this.puzzleDate = puzzleDate;
    this.puzzleNumber = puzzleNumber;
    this.isLatestPuzzle = isLatestPuzzle;
    this.puzzleAnswer = puzzleAnswer;
    this.sheetSource = sheetSource;
    this.puzzleCategory = puzzleCategory;
    this.puzzleId = puzzleId;
    this.difficulty = difficulty;
  }

  getPuzzleShortTitle(): string {
    return `${getCategoryAbbreviation(this.puzzleCategory)}${this.puzzleNumber}`;
  }

  getDifficultyIcon(): string {
    switch (this.difficulty) {
      case 1:
        return "🟢";
      case 2:
        return "🟡";
      case 3:
        return "🔴";
      default:
        return "";
    }
  }
}
