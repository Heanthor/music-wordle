import { ComposerWork } from "./composerWork";

export type PuzzleCategory = "Piano" | "Violin" | "Cello" | "Orchestral";

export const puzzleCategories: PuzzleCategory[] = [
  "Piano",
  "Violin",
  "Cello",
  "Orchestral",
];

export class DailyPuzzle {
  puzzleDate: Date;
  puzzleAnswer: ComposerWork;
  sheetSource: string;

  constructor(
    puzzleDate: Date,
    puzzleAnswer: ComposerWork,
    sheetSource: string
  ) {
    this.puzzleDate = puzzleDate;
    this.puzzleAnswer = puzzleAnswer;
    this.sheetSource = sheetSource;
  }
}
