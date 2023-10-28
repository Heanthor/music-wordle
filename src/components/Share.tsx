import { useState } from "react";
import { ComposerWork } from "../composerWork";
import { DailyPuzzle} from "../dailyPuzzle";

type Props = {
    guesses: ComposerWork[];
    dailyPuzzle: DailyPuzzle;
};

function Share(props: Props) {    
    const { guesses, dailyPuzzle } = props;
    const [isTextCopied, setIsTextCopied] = useState(false);

    // Copy the puzzle date and the user's guesses to the clipboard to share on social media
    const copyShareToClipboard = (): void => {
        const puzzleAnswer = dailyPuzzle.puzzleAnswer;
        let stringifiedGuesses = `Music Wordle ${dailyPuzzle.puzzleDate.toLocaleDateString()}\n`;
        guesses.forEach((guess: ComposerWork) => {
            stringifiedGuesses += (guess.composer === puzzleAnswer.composer ? "🟩" : "🟥");
            stringifiedGuesses += (guess.work === puzzleAnswer.work ? "🟩\n" : "🟥\n");
        });
        navigator.clipboard.writeText(stringifiedGuesses);
        setIsTextCopied(true);
    }

    return (
        <div className="mt-1">
            <button
                className="px-2 py-1 font-semibold text-sm bg-cyan-500 border-solid border-2 border-sky-700 text-neutral-50 rounded-lg md:rounded-lg shadow-sm w-full md:w-auto md:py-2 hover:bg-sky-600 align-middle"
                onClick={copyShareToClipboard}
            >
                <span>Share</span>
            </button>
            { isTextCopied && <div className="mt-1">Copied results to clipboard ✅</div> }
        </div>
    );
}

export default Share;