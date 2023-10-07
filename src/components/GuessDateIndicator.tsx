import React from "react";

type Props = {
    guessYear: number;
    targetYear: number;
    composerCareerLength: number
};

function GuessDateIndicator({ guessYear, targetYear, composerCareerLength }: Props) {
    const guessDiffToColor = (): number => {
        const diffAbs = Math.abs(guessYear - targetYear);
        const diffPercent = diffAbs / composerCareerLength;

        const steps = [];
        for (let i = 900; i > 0; i -= 100) {
            steps.push(i);
        }

        const choice = steps[steps.length - Math.floor(steps.length * diffPercent) - 1]
        return choice;
    };

    const getArrow = (): string => {
        if (guessYear < targetYear) {
            return "↑";
        } else if (guessYear > targetYear) {
            return "↓";
        } else {
            return "-";
        }
    };

    const colorStr = `bg-sky-${guessDiffToColor()} w-[2rem] rounded-lg py-1 px-2 mr-2 text-blue-800 text-md font-semibold flex flex-col justify-center content-center`
    return (
        <div className={colorStr}>
            <span>{getArrow()}</span>
        </div>
    )
}

export default GuessDateIndicator;