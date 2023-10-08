import { ReactNode } from "react";
import { ComposerWork, getYearRangesByComposerId } from "../composerWork";
import { currentPuzzle } from "../dailyPuzzle";

type Props = {
    guess: ComposerWork;
};

function WorkCard(props: Props) {
    const { guess } = props;
    const { puzzleAnswer } = currentPuzzle;
    const yearRange = getYearRangesByComposerId()[puzzleAnswer.composer];

    const correct = puzzleAnswer.equals(guess);

    const renderHint = (): string => {
        const dateDiff = Math.abs(guess.compositionYear - puzzleAnswer.compositionYear);
        let bigDiff = false;
        if (dateDiff / yearRange > 0.3) {
            bigDiff = true;
        }
        if (guess.compositionYear < puzzleAnswer.compositionYear) {
            return bigDiff ? "Composed much earlier" : "Composed earlier";
        } else if (guess.compositionYear > puzzleAnswer.compositionYear) {
            return bigDiff ? "Composed much later" : "Composed later";
        } else {
            return "Composed same year!"
        }
    };

    const renderCardTitle = (
        text: string,
        correct: boolean = true
    ): ReactNode => (
        <div className="flex justify-between">
            <span>{text}</span>
            <div className="inline">
                <span className="text-xs md:text-sm font-light mr-1 text-neutral-300">{renderHint()}</span>
                <span>{correct ? "✅" : "❌"}</span>
            </div>
        </div>
    );

    const constructWorkText = (guess: ComposerWork): string => `${guess.work} (${guess.compositionYear})`;

    return (
        <div
            className={`block min-w-[14rem] h-full flex-grow rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-indigo-500 border-solid border-2 border-indigo-400`}
        >
            <div className="flex flex-col justify-between p-2 h-full">
                <h5 className="mb-1 text-sm md:text-base font-medium leading-tight text-neutral-50">
                    {renderCardTitle("Work", correct)}
                </h5>
                <p className="text-xs md:text-sm leading-normal text-neutral-100">
                    {constructWorkText(guess)}
                </p>
            </div>
        </div>
    );
}

export default WorkCard;
