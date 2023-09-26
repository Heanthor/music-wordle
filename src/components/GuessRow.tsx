import React from "react";
import GuessRowContainer from "./GuessRowContainer";
import GuessRowCard from "./GuessRowCard";
import { ComposerWork } from "../composerWork";
import { currentPuzzle } from "../dailyPuzzle";

function GuessRow({ rowNumber, guess }: { rowNumber: number, guess: ComposerWork }) {
    const composerCorrect = (guess: ComposerWork): boolean =>
        guess.composer === currentPuzzle?.puzzleAnswer.composer;

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
                correct={currentPuzzle?.puzzleAnswer.matchWork(guess.work)}
            />
        </GuessRowContainer>
    )
}

export default GuessRow;