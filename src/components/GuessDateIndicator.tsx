import React from "react";

type Props = {
    guessYear: number;
    targetYear: number;
    composerCareerLength: number
};

function GuessDateIndicator({ guessYear, targetYear, composerCareerLength }: Props) {
    const guessDiffToColor = (): string => {
        const diffAbs = Math.abs(guessYear - targetYear);
        const diffPercent = diffAbs / composerCareerLength;

        const steps = [];
        for (let i = 900; i > 0; i -= 100) {
            steps.push(i);
        }

        const choice = steps[steps.length - Math.floor(steps.length * diffPercent) - 1];

        // tailwind sucks
        const classes: { [choice: number]: string } = {
            100: "bg-sky-100",
            200: "bg-sky-200",
            300: "bg-sky-300",
            400: "bg-sky-400",
            500: "bg-sky-500",
            600: "bg-sky-600",
            700: "bg-sky-700",
            800: "bg-sky-800",
            900: "bg-sky-900",
        };

        return classes[choice];
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

    return (
        <div className={`${guessDiffToColor()} w-[2rem] rounded-lg py-1 px-2 mr-2 text-blue-800 text-md font-semibold flex flex-col justify-center content-center`}>
            <span>{getArrow()}</span>
        </div>
    )
}

export default GuessDateIndicator;