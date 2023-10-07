import React from "react";
import GuessRowContainer from "./GuessRowContainer";
import GuessRowCard from "./GuessRowCard";
import { ComposerWork } from "../composerWork";
import { currentPuzzle } from "../dailyPuzzle";
import GuessDateIndicator from "./GuessDateIndicator";
import { getYearRangesByComposerId } from "../composerWork";

function GuessRow({ rowNumber, guess }: { rowNumber: number, guess: ComposerWork }) {
    const { puzzleAnswer } = currentPuzzle;

    const composerCorrect = (guess: ComposerWork): boolean =>
        guess.composer === puzzleAnswer.composer;

    const yearRange = getYearRangesByComposerId()[puzzleAnswer.composer];

    return (
        <GuessRowContainer rowNumber={rowNumber}>
            <GuessRowCard
                title="Composer"
                text={guess.composer}
                backgroundClass="cyan-500"
                widthRem={12}
                correct={composerCorrect(guess)}
            />
            <GuessRowCard
                title="Work"
                text={guess.work}
                backgroundClass="indigo-500"
                widthRem={14}
                correct={puzzleAnswer.matchWork(guess.work)}
            />
            <GuessDateIndicator guessYear={guess.compositionYear} targetYear={puzzleAnswer.compositionYear} composerCareerLength={yearRange} />
        </GuessRowContainer>
    )
}

export default GuessRow;