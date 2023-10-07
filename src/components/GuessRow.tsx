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
            {composerCorrect(guess) ?
                <GuessDateIndicator guessYear={guess.compositionYear} targetYear={puzzleAnswer.compositionYear} composerCareerLength={yearRange} />
                : <div className="block max-w-[2rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-slate-400 mr-2 flex-grow"></div>}
        </GuessRowContainer>
    )
}

export default GuessRow;