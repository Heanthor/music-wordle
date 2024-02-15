import { useState, useEffect, useCallback, ReactNode } from "react";
import { ComposerWork } from "../composerWork";
import { PuzzleCategory } from "../dailyPuzzle";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import PlaceholderRow from "./PlaceholderRow";
import GuessInput from "./GuessInput";
import GuessRow from "./GuessRow";
import PuzzlePicker from "./PuzzlePicker";
import ConfettiExplosion from "react-confetti-explosion";

import Share from "./Share";

import { usePuzzle } from "../hooks/queries";
import SpinnerWrapper from "./SpinnerWrapper";

type GameState = "guessing" | "won" | "lost";

type SavedGameState = {
    guesses: ComposerWork[];
    gameState: GameState;
};

function GameInstance({ puzzleCategory }: { puzzleCategory: PuzzleCategory }) {
    const MAX_GUESSES = 6;

    const { data: puzzleData, status: puzzleStatus } = usePuzzle();

    const [gameState, setGameState] = useState<GameState>("guessing");
    const [guesses, setGuesses] = useState<ComposerWork[]>([]);
    const [error, setError] = useState("");

    const [imageLoaded, setImageLoaded] = useState(false);

    const getCacheKey = useCallback(() => {
        const ds = new Date().toLocaleString();
        return `game-state_${puzzleCategory}-${puzzleData?.puzzleNumber
            }-${ds.substring(0, ds.indexOf(","))}`;
    }, [puzzleCategory, puzzleData]);

    const loadGameState = useCallback(() => {
        const loadedState = JSON.parse(
            localStorage.getItem(getCacheKey()) || "{}"
        ) as SavedGameState;
        if (
            !loadedState.guesses ||
            !loadedState.gameState ||
            guesses.length !== 0
        ) {
            return;
        }

        // annoyingly cast regular objects into ComposerWork objects
        const guessObjs = loadedState.guesses.map(
            (g: ComposerWork) =>
                new ComposerWork(
                    g.composer,
                    g.composerId,
                    g.work,
                    g.compositionYear,
                    g.opus,
                    g.opusNumber
                )
        );

        setGuesses(guessObjs);
        setGameState(loadedState.gameState);
    }, [getCacheKey, guesses.length]);

    useEffect(() => {
        if (puzzleStatus === "success") {
            loadGameState();
        }
    }, [loadGameState, puzzleStatus]);

    useEffect(() => {
        if (guesses.length !== 0 && puzzleStatus === "success") {
            localStorage.setItem(
                getCacheKey(),
                JSON.stringify({ guesses, gameState })
            );
        }
    }, [guesses, gameState, puzzleStatus, getCacheKey]);

    const checkGameState = (newGuesses: ComposerWork[]) => {
        if (puzzleStatus !== "success") {
            return;
        }

        // lil state machine
        const mostRecentGuess = newGuesses.slice(-1)[0];

        if (mostRecentGuess.equals(puzzleData.puzzleAnswer)) {
            setGameState("won");
        } else if (newGuesses.length === MAX_GUESSES) {
            setGameState("lost");
        }
    };

    const makeGuess = (composerWork: ComposerWork) => {
        if (gameState !== "guessing") {
            return;
        }

        if (guesses.find((g) => g.equals(composerWork))) {
            setErrorWithTimeout("duplicateGuess");
            return;
        }

        const newGuesses = [...guesses, composerWork];
        setGuesses(newGuesses);
        checkGameState(newGuesses);
    };

    const setErrorWithTimeout = (text: string): void => {
        setError(text);
        setTimeout(() => setError(""), 2000);
    };

    const renderGuesses = (): ReactNode => {
        const guessItems = guesses.map((guess, i) => (
            <GuessRow key={i + 1} rowNumber={i + 1} guess={guess} />
        ));

        for (let i = 0; i < MAX_GUESSES - guesses.length; i++) {
            // fill remainder with placeholders
            const rowNumber = i + guesses.length + 1;
            guessItems.push(<PlaceholderRow key={rowNumber} rowNumber={rowNumber} />);
        }

        return guessItems;
    };

    const renderError = (): ReactNode => {
        let errorText;
        switch (error) {
            case "duplicateGuess":
                errorText = "You've already guessed that!";
                break;
        }
        return (
            <div className="flex justify-center">
                <div
                    className="w-4/5 md:w-1/2 mb-4 rounded-lg bg-red-200 px-2 py-1 md:px-6 md:py-5 text-base text-red-700"
                    role="alert"
                >
                    {errorText}
                </div>
            </div>
        );
    };

    const renderConfetti = () => {
        return (
            <div className="flex justify-center">
                <ConfettiExplosion particleCount={500} duration={3000} />
            </div>
        );
    };

    const renderGameEndMessage = () => {
        if (gameState === "guessing") {
            return null;
        }

        const correctAnswer = puzzleData?.puzzleAnswer.composer + " - " + puzzleData?.puzzleAnswer.work;
        const messageState = {
            won: {
                text: "Congrats, you won!",
                extraText: null,
                background: "bg-green-200",
                textColor: "bg-green-700",
            },
            lost: {
                text: "Sorry, try again next time!",
                extraText: "Answer: " + correctAnswer,
                background: "bg-red-200",
                textColor: "bg-red-700",
            },
        };

        const params = messageState[gameState];
        return (
            <div className="flex justify-center">
                <div
                    className={`w-4/5 md:w-1/2 mb-4 rounded-lg ${params.background} px-2 py-1 md:px-6 md:py-5 text-base text-${params.textColor}}`}
                    role="alert"
                >
                    {params.text}
                    {params.extraText && (
                        <div className="font-bold">{params.extraText}</div>
                    )}
                    {puzzleData && (
                        <Share guesses={guesses} dailyPuzzle={puzzleData} />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto text-center w-3/4">
            {gameState === "won" && renderConfetti()}
            <PuzzlePicker currentPuzzle={puzzleData} />
            <h1 className="text-xl md:text-2xl text-neutral-50 py-4 pt-1">
                Guess the composer and title of the following work:
            </h1>
            <div className="pb-4">
                <Zoom>
                    {imageLoaded ? null : (
                        <div className="bg-gray-300 h-80 outline rounded-md min-w-full flex justify-center items-center">
                            <SpinnerWrapper />
                        </div>
                    )}
                    <img
                        className={"mx-auto outline rounded-md min-w-full" + (imageLoaded ? "" : " hidden")}
                        src={puzzleData?.sheetSource}
                        onLoad={() => setImageLoaded(true)}
                    />
                </Zoom>
            </div>
            <div className="bg-gray-300 p-2 rounded-sm shadow-md mb-4">
                {renderGameEndMessage()}
                <GuessInput onSubmit={makeGuess} disabled={gameState === "won" || gameState === "lost"} />
                {error && renderError()}
            </div>
            <div className="bg-gray-300 p-2 rounded-sm shadow-md">
                {renderGuesses()}
            </div>
        </div>
    );
}

export default GameInstance;
