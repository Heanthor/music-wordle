import { PuzzleCategory, puzzleCategories } from "./dailyPuzzle";

import { Params } from "react-router-dom";

export type CategoryPuzzleIDLoaderData = {
  puzzleCategory: PuzzleCategory;
  puzzleID: number;
};

export const categoryPuzzleIDLoader = ({ params }: { params: Params<string> }) => {
    const { puzzleCategory, puzzleID } = params;
    let match = puzzleCategories.find((category: PuzzleCategory) => category.toLowerCase() === puzzleCategory?.toLowerCase());
  
    if (!match) {
      // default category
      match = puzzleCategories[0];
    }

    let pID = parseInt(puzzleID || "-1");
    if (!puzzleID) {
      pID = -1
    }
  
    return {
      puzzleCategory: match,
      puzzleID: pID,
    };
  };
  