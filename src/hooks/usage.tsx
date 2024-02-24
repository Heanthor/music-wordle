import { useMutation } from "@tanstack/react-query";
import { sendUsageEvent } from "../fetchers";

import { useContext } from 'react';
import { UuidContext } from '../contexts';

export type UsageEvent = "puzzle_viewed" | "puzzle_solved" | "puzzle_failed" | "guess_made"

export const sendGuessUsageEventParams = (puzzleId: number, workId: number) => {
    return {
        event: "guess_made" as UsageEvent,
        puzzleId: puzzleId,
        body: { guess: workId }
    }
}

export const sendPuzzleViewedUsageEventParams = (puzzleId: number) => {
    return {
        event: "puzzle_viewed" as UsageEvent,
        puzzleId: puzzleId,
        body: {}
    }
}

export const sendPuzzleSolvedUsageEventParams = (puzzleId: number) => {
    return {
        event: "puzzle_solved" as UsageEvent,
        puzzleId: puzzleId,
        body: {}
    }
}

export const sendPuzzleFailedUsageEventParams = (puzzleId: number) => {
    return {
        event: "puzzle_failed" as UsageEvent,
        puzzleId: puzzleId,
        body: {}
    }
}

type UsageEventVars = {
    event: UsageEvent;
    puzzleId: number;
    // todo this could be a union type of all possible body shapes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
}
export const useSendUsageEvent = () => {
    const uuid = useContext(UuidContext);
    return useMutation({
        mutationFn: (variables: UsageEventVars) => sendUsageEvent(variables.event, uuid || "", variables.puzzleId, variables.body),
    });
}
