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

export class DailyPuzzle {
  puzzleDate: Date;
  puzzleNumber: number;
  isLatestPuzzle: boolean;
  puzzleAnswer: ComposerWork;
  sheetSource: string;

  constructor(
    puzzleDate: Date,
    puzzleNumber: number,
    isLatestPuzzle: boolean,
    puzzleAnswer: ComposerWork,
    sheetSource: string
  ) {
    this.puzzleDate = puzzleDate;
    this.puzzleNumber = puzzleNumber;
    this.isLatestPuzzle = isLatestPuzzle;
    this.puzzleAnswer = puzzleAnswer;
    this.sheetSource = sheetSource;
  }
}
