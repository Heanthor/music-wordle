import { PuzzleCategory, puzzleCategories } from "./dailyPuzzle";

import {  Params } from "react-router-dom";


export const categoryLoader = ({ params }: { params: Params<string> }) => {
    const { puzzleCategory } = params;
    const match = puzzleCategories.find((category: PuzzleCategory) => category.toLowerCase() === puzzleCategory?.toLowerCase());
  
    if (!match) {
      // default category
      return puzzleCategories[0];
    }
  
    return match;
  };
  