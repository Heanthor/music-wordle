import { ComposerWork } from "./composerWork";
import sheet1 from "./assets/music-1.png";

export class DailyPuzzle {
  puzzleNumber: number;
  puzzleAnswer: ComposerWork;
  compositionYear: number;
  sheetSource: string;

  constructor(
    puzzleNumber: number,
    puzzleAnswer: ComposerWork,
    compositionYear: number,
    sheetSource: string
  ) {
    this.puzzleNumber = puzzleNumber;
    this.puzzleAnswer = puzzleAnswer;
    this.compositionYear = compositionYear;
    this.sheetSource = sheetSource;
  }
}

export const puzzles: DailyPuzzle[] = [
  {
    puzzleNumber: 1,
    puzzleAnswer: new ComposerWork(
      "Frederic Chopin",
      "Ballade No. 1 in G Minor"
    ),
    compositionYear: 1835,
    sheetSource: sheet1,
  },
];
