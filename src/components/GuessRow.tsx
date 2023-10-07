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

    const constructWorkText = (guess: ComposerWork): string => `${guess.work} (${guess.compositionYear})`;
    return (
        <GuessRowContainer rowNumber={rowNumber}>
            <div className="flex flex-col md:flex-row md:justify-center">
                <div className="mb-2 md:mb-0">
                    <GuessRowCard
                        title="Composer"
                        text={guess.composer}
                        backgroundClass="bg-cyan-500"
                        widthRem={12}
                        correct={composerCorrect(guess)}
                    />
                </div>
                <GuessRowCard
                    title="Work"
                    text={constructWorkText(guess)}
                    backgroundClass="bg-indigo-500"
                    widthRem={14}
                    correct={puzzleAnswer.matchWork(guess.work)}
                />
            </div>
            {composerCorrect(guess) ?
                <GuessDateIndicator guessYear={guess.compositionYear} targetYear={puzzleAnswer.compositionYear} composerCareerLength={yearRange} />
                : <div className="block max-w-[2rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-slate-400 mr-2 flex-grow"></div>}
        </GuessRowContainer>
    );
}

export default GuessRow;