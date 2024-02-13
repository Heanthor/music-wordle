import { ReactNode } from "react";
import { ComposerWork } from "../composerWork";
import { CategoryPuzzleIDLoaderData } from "../loaders";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getComposerDateRange, getLatestPuzzle } from "../fetchers";

type Props = {
    guess: ComposerWork;
};

function WorkCard(props: Props) {
    const routeData = useLoaderData() as CategoryPuzzleIDLoaderData;
    const puzzleCategory = routeData.puzzleCategory;

    const { guess } = props;
    const puzzleAnswer = useQuery({ queryKey: ["latest-puzzle", puzzleCategory], queryFn: () => getLatestPuzzle(puzzleCategory) });

    const hasData = !puzzleAnswer.isError && !puzzleAnswer.isPending
    const composerCorrect = (guess: ComposerWork): boolean =>
        hasData && guess.composer === puzzleAnswer.data.puzzleAnswer.composer;
    const correct = hasData && puzzleAnswer.data.puzzleAnswer.equals(guess);
    const useDateRangeHook = (composerId: number, enabled: boolean) => useQuery({
        queryKey: ["date-range", { composerId }],
        queryFn: () => getComposerDateRange(composerId),
        enabled: enabled,
    });

    // api call to retrieve all supported composers
    const guessedComposerDateRange = useDateRangeHook(guess.composerId, composerCorrect(guess));
    const answerComposerDateRange = useDateRangeHook(puzzleAnswer.data?.puzzleAnswer.composerId || 0, hasData && composerCorrect(guess));

    const renderHint = (): string | null => {
        if (!composerCorrect(guess) || (composerCorrect(guess) && correct)) {
            // don't render hint if the composer is wrong, or if you win the game
            return null;
        }

        if (guessedComposerDateRange.isPending || answerComposerDateRange.isPending) {
            return "-";
        }

        if (!hasData) {
            return "-";
        }

        if (guessedComposerDateRange.isError || answerComposerDateRange.isError) {
            console.log("error fetching date range")
            return "";
        }

        const yearRange = answerComposerDateRange.data?.max - answerComposerDateRange.data?.min || 0;
        const dateDiff = Math.abs(
            guess.compositionYear - puzzleAnswer.data.puzzleAnswer.compositionYear
        );
        let bigDiff = false;
        if (dateDiff / yearRange > 0.3) {
            bigDiff = true;
        }
        if (guess.compositionYear < puzzleAnswer.data.puzzleAnswer.compositionYear) {
            return bigDiff ? "Composed much earlier" : "Composed earlier";
        } else if (guess.compositionYear > puzzleAnswer.data.puzzleAnswer.compositionYear) {
            return bigDiff ? "Composed much later" : "Composed later";
        } else {
            return "Composed same year!";
        }
    };

    const renderCardTitle = (
        text: string,
        correct: boolean = true
    ): ReactNode => (
        <div className="flex justify-between">
            <span>{text}</span>
            <div className="inline">
                <span className="text-xs md:text-sm font-light mr-1 text-neutral-300">
                    {renderHint()}
                </span>
                <span>{correct ? "✅" : "❌"}</span>
            </div>
        </div>
    );

    const constructWorkText = (guess: ComposerWork): string =>
        `${guess.work} (${guess.compositionYear})`;

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
