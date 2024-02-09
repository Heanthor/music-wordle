import { ComposerWork } from "./composerWork";
// // TODO load these images from a CDN instead?
// import piano1 from "./assets/puzzle_images/piano-1.png";
// import piano2 from "./assets/puzzle_images/piano-2.png";
// import piano3 from "./assets/puzzle_images/piano-3.png";
// import piano4 from "./assets/puzzle_images/piano-4.png";
// import piano5 from "./assets/puzzle_images/piano-5.png";
// import cello1 from "./assets/puzzle_images/cello-1.png";
// import cello2 from "./assets/puzzle_images/cello-2.png";
// import violin1 from "./assets/puzzle_images/violin-1.png";
// import violin2 from "./assets/puzzle_images/violin-2.png";
// import violin3 from "./assets/puzzle_images/violin-3.png";
// import violin4 from "./assets/puzzle_images/violin-4.png";
// import violin5 from "./assets/puzzle_images/violin-5.png";
// import orch2 from "./assets/puzzle_images/orch-2.png";

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

// const pianoPuzzles: DailyPuzzle[] = [
//   {
//     puzzleDate: new Date("2023-09-24"),
//     // chopin ballade no. 1
//     puzzleAnswer: getComposerWorkByID(4, 35),
//     sheetSource: piano1,
//   },
//   {
//     puzzleDate: new Date("2023-10-15"),
//     // beethoven pastoral sonata
//     puzzleAnswer: getComposerWorkByID(0, 46),
//     sheetSource: piano2,
//   },
//   {
//     puzzleDate: new Date("2023-10-16"),
//     // beethoven rage over a lost penny (rondo a capriccio)
//     puzzleAnswer: getComposerWorkByID(0, 221),
//     sheetSource: piano3,
//   },
//   {
//     puzzleDate: new Date("2023-10-17"),
//     // tchaikovsky the seasons (june)
//     puzzleAnswer: getComposerWorkByID(3, 221),
//     sheetSource: piano4,
//   },
//   {
//     puzzleDate: new Date("2023-10-18"),
//     // brahms intermezzo 118 no. 2
//     puzzleAnswer: getComposerWorkByID(5, 565),
//     sheetSource: piano5,
//   },
// ];

// const violinPuzzles: DailyPuzzle[] = [
//   {
//     puzzleDate: new Date("2023-10-18"),
//     // mozart e minor violin sonata
//     puzzleAnswer: getComposerWorkByID(1, 264),
//     sheetSource: violin1,
//   },
//   {
//     puzzleDate: new Date("2023-10-19"),
//     // brahms violin sonata 1
//     puzzleAnswer: getComposerWorkByID(5, 410),
//     sheetSource: violin2,
//   },
//   {
//     puzzleDate: new Date("2023-10-20"),
//     // tchaikovsky valse-scherzo
//     puzzleAnswer: getComposerWorkByID(3, 36),
//     sheetSource: violin3,
//   },
//   {
//     puzzleDate: new Date("2023-10-20"),
//     // beethoven kreutzer sonata
//     puzzleAnswer: getComposerWorkByID(0, 65),
//     sheetSource: violin4,
//   },
//   {
//     puzzleDate: new Date("2023-10-21"),
//     // bach c major sonata
//     puzzleAnswer: getComposerWorkByID(2, 823),
//     sheetSource: violin5,
//   },
// ];

// const celloPuzzles: DailyPuzzle[] = [
//   {
//     puzzleDate: new Date("2023-10-07"),
//     // bach cello suite 1
//     puzzleAnswer: getComposerWorkByID(2, 650),
//     sheetSource: cello1,
//   },
//   {
//     puzzleDate: new Date("2023-10-19"),
//     // tchaikovsky rococo variations
//     puzzleAnswer: getComposerWorkByID(3, 35),
//     sheetSource: cello2,
//   },
// ];

// const orchestralPuzzles: DailyPuzzle[] = [
//     {
//         puzzleDate: new Date("2023-10-23"),
//         // tchaikovsky symphony 4
//         puzzleAnswer: getComposerWorkByID(3, 13),
//         sheetSource: orch2,
//     },
// ];

// const puzzles: { [category in PuzzleCategory]: DailyPuzzle[] } = {
//   Piano: pianoPuzzles,
//   Violin: violinPuzzles,
//   Cello: celloPuzzles,
//   Orchestral: orchestralPuzzles,
// };

// export const currentPuzzle = (puzzleCategory: PuzzleCategory): DailyPuzzle => {
//   const currentDate = new Date();
//   const puzzleList = puzzles[puzzleCategory];

//   return (
//     puzzleList.find((puzzle) => puzzle.puzzleDate === currentDate) ||
//     puzzleList.slice(-1)[0]
//   );
// };
