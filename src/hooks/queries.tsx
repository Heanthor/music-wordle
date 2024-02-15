import { useLoaderData } from "react-router-dom";
import { CategoryPuzzleIDLoaderData } from "../loaders";

import { useQuery } from "@tanstack/react-query";
import { getLatestPuzzle, getPuzzleBySequenceNumber } from "../fetchers";

export const usePuzzle = () => {
    const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
    const puzzleCategory = routeData.puzzleCategory;
    const sequenceNum = routeData.puzzleID;

    // if we can pull a sequence number from the route, use it to fetch a specific puzzle
    // otherwise, we fetch latest
    let queryFn;
    let queryKey;
    if (sequenceNum < 0) {
        queryFn = () => getLatestPuzzle(puzzleCategory);
        queryKey = ["latest-puzzle", puzzleCategory];
    } else {
        queryFn = () => getPuzzleBySequenceNumber(puzzleCategory, sequenceNum);
        queryKey = ["puzzle", puzzleCategory, sequenceNum];
    }

    return useQuery({
        queryKey: queryKey,
        queryFn,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
