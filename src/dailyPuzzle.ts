import { ComposerWork } from "./composerWork";

export type PuzzleCategory = "Piano" | "Violin" | "Cello" | "Orchestral";

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

export class DailyPuzzle {
  puzzleDate: Date;
  puzzleNumber: number;
  isLatestPuzzle: boolean;
  puzzleAnswer: ComposerWork;
  sheetSource: string;
  puzzleCategory: PuzzleCategory;
  puzzleId: number;

  constructor(
    puzzleDate: Date,
    puzzleNumber: number,
    isLatestPuzzle: boolean,
    puzzleAnswer: ComposerWork,
    sheetSource: string,
    puzzleCategory: PuzzleCategory,
    puzzleId: number,
  ) {
    this.puzzleDate = puzzleDate;
    this.puzzleNumber = puzzleNumber;
    this.isLatestPuzzle = isLatestPuzzle;
    this.puzzleAnswer = puzzleAnswer;
    this.sheetSource = sheetSource;
    this.puzzleCategory = puzzleCategory;
    this.puzzleId = puzzleId;
  }

  getPuzzleShortTitle(): string {
    return `${getCategoryAbbreviation(this.puzzleCategory)}${this.puzzleNumber}`;
  }
}
