import { ComposerWork, getComposerWorkByID } from "./composerWork";
// TODO load these images from a CDN instead
import sheet1 from "./assets/music-1.png";

export class DailyPuzzle {
  puzzleNumber: number;
  puzzleDate: Date;
  puzzleAnswer: ComposerWork;
  sheetSource: string;

  constructor(
    puzzleNumber: number,
    puzzleDate: Date,
    puzzleAnswer: ComposerWork,
    sheetSource: string
  ) {
    this.puzzleNumber = puzzleNumber;
    this.puzzleDate = puzzleDate;
    this.puzzleAnswer = puzzleAnswer;
    this.sheetSource = sheetSource;
  }
}

export const puzzles: DailyPuzzle[] = [
  {
    puzzleNumber: 1,
    puzzleDate: new Date("2023-09-24"),
    // chopin ballade no. 1
    puzzleAnswer: getComposerWorkByID(4, 35),
    sheetSource: sheet1,
  },
];

export const currentPuzzle = puzzles.slice(-1)[0];