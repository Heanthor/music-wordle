import { ComposerWork, getComposerWorkByID } from "./composerWork";
// TODO load these images from a CDN instead
import sheet1 from "./assets/music-1.png";
import sheet2 from "./assets/music-2.png";

export type PuzzleCategory = "Piano" | "Violin" | "Cello" | "Orchestral";

export const puzzleCategories: PuzzleCategory[] = [
    "Piano",
    "Violin",
    "Cello",
    "Orchestral",
]

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

const pianoPuzzles: DailyPuzzle[] = [
  {
    puzzleDate: new Date("2023-09-24"),
    // chopin ballade no. 1
    puzzleAnswer: getComposerWorkByID(4, 35),
    sheetSource: sheet1,
  },
];

const violinPuzzles: DailyPuzzle[] = [

];

const celloPuzzles: DailyPuzzle[] = [
  {
    puzzleDate: new Date("2023-10-07"),
    // bach cello suite 1
    puzzleAnswer: getComposerWorkByID(2, 650),
    sheetSource: sheet2,
  },
];

const orchestralPuzzles: DailyPuzzle[] = [

];

const puzzles: {[category in PuzzleCategory]: DailyPuzzle[]} = {
    "Piano": pianoPuzzles,
    "Violin": violinPuzzles,
    "Cello": celloPuzzles,
    "Orchestral": orchestralPuzzles,
}

// export const currentPuzzle = puzzles.slice(-1)[0];
export const currentPuzzle = (puzzleCategory: PuzzleCategory): DailyPuzzle => {
    const puzzleList = puzzles[puzzleCategory];
    return puzzleList.slice(-1)[0];
};