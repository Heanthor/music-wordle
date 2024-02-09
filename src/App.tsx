import { useState, ReactNode } from "react";
import { ComposerWork } from "./composerWork";
import { PuzzleCategory } from "./dailyPuzzle";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import PlaceholderRow from "./components/PlaceholderRow";
import GuessInput from "./components/GuessInput";
import GuessRow from "./components/GuessRow";
import ConfettiExplosion from "react-confetti-explosion";
import Header from "./components/Header";

import { useLoaderData } from "react-router-dom";
import Share from "./components/Share";

import { useQuery } from "@tanstack/react-query";
import { getLatestPuzzle } from "./fetchers";

type GameState = "guessing" | "won" | "lost";


function App() {
  const MAX_GUESSES = 6;

  const puzzleCategoryData = useLoaderData() as PuzzleCategory;
  const currentPuzzleAnswer = useQuery({ queryKey: ["latest-puzzle", puzzleCategoryData], queryFn: () => getLatestPuzzle(puzzleCategoryData) });

  const [gameState, setGameState] = useState<GameState>("guessing");
  const [guesses, setGuesses] = useState<ComposerWork[]>([]);
  const [error, setError] = useState("");

  const checkGameState = (newGuesses: ComposerWork[]) => {
    if (currentPuzzleAnswer.isError || currentPuzzleAnswer.isPending) {
      return;
    }

    // lil state machine
    const mostRecentGuess = newGuesses.slice(-1)[0];

    if (mostRecentGuess.equals(currentPuzzleAnswer.data.puzzleAnswer)) {
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

    const messageState = {
      won: {
        text: "Congrats, you won!",
        background: "bg-green-200",
        textColor: "bg-green-700",
      },
      lost: {
        text: "Sorry, try again next time!",
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
          {gameState === "won" && currentPuzzleAnswer.data && <Share guesses={guesses} dailyPuzzle={currentPuzzleAnswer.data} />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-900">
      <Header puzzleCategory={puzzleCategoryData} />
      <div className="container mx-auto text-center w-3/4">
        {gameState === "won" && renderConfetti()}
        <div className="bg-blue-700 p-2 rounded-md shadow-md my-4 text-left border-blue-500 border-solid border-2">
          <div className="bg-blue-500 rounded-sm p-1 pl-2 flex justify-between">
            <span className=" text-neutral-50 text-sm font-bold">News</span>
            <span className=" text-neutral-300 text-sm pr-2 font-bold">Oct 21, 2023</span>
          </div>
          <p className="text-neutral-50 text-sm pl-2 pt-1">
            I am adding more composers...
          </p>
        </div>
        <h1 className="text-xl md:text-2xl text-neutral-50 py-4">
          Guess the composer and title of the following work:
        </h1>
        <div className="pb-4">
          <Zoom>
            <img
              className="mx-auto outline rounded-md"
              src={currentPuzzleAnswer.data?.sheetSource}
            />
          </Zoom>
        </div>
        <div className="bg-gray-300 p-2 rounded-sm shadow-md mb-4">
          {renderGameEndMessage()}
          <GuessInput onSubmit={makeGuess} />
          {error && renderError()}
        </div>
        <div className="bg-gray-300 p-2 rounded-sm shadow-md">
          {renderGuesses()}
        </div>
      </div>
    </div>
  );
}

export default App;
