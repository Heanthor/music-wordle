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

    const renderCardTitle = (
        text: string,
        correct: boolean = true
    ): ReactNode => (
        <div className="flex justify-between">
            <span>{text}</span>
            <span>{correct ? "✅" : "❌"}</span>
        </div>
    );

    const constructWorkText = (guess: ComposerWork): string => `${guess.work} (${guess.compositionYear})`;

    return (
        <div
            className={`block min-w-[14rem] flex-grow rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-indigo-500 mr-2`}
        >
            <div className="p-2">
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
