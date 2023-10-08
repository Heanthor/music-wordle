import { useState, ReactNode } from "react";
import { ComposerWork } from "./composerWork";
import { currentPuzzle } from "./dailyPuzzle";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import PlaceholderRow from "./components/PlaceholderRow";
import GuessInput from "./components/GuessInput";
import GuessRow from "./components/GuessRow";
import ConfettiExplosion from "react-confetti-explosion";
import Header from "./components/Header";

type GameState = "guessing" | "won" | "lost";

function App() {
  const MAX_GUESSES = 6;

  const [gameState, setGameState] = useState<GameState>("guessing");
  const [guesses, setGuesses] = useState<ComposerWork[]>([]);
  const [error, setError] = useState("");

  const checkGameState = (newGuesses: ComposerWork[]) => {
    // lil state machine
    const mostRecentGuess = newGuesses.slice(-1)[0];
    const puzzleAnswer = currentPuzzle?.puzzleAnswer;

    if (mostRecentGuess.equals(puzzleAnswer)) {
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
        background: "green-200",
        textColor: "green-700",
      },
      lost: {
        text: "Sorry, try again next time!",
        background: "red-200",
        textColor: "red-700",
      },
    };

    const params = messageState[gameState];
    return (
      <div className="flex justify-center">
        <div
          className={`w-4/5 md:w-1/2 mb-4 rounded-lg bg-${params.background} px-2 py-1 md:px-6 md:py-5 text-base text-${params.textColor}}`}
          role="alert"
        >
          {params.text}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-900">
      <Header />
      <div className="container mx-auto text-center w-3/4">
        {gameState === "won" && renderConfetti()}
        <h1 className="text-xl md:text-2xl text-neutral-50 py-4">
          Guess the composer and title of the following work:
        </h1>
        <div className="pb-4">
          <Zoom>
            <img
              className="mx-auto outline rounded-md"
              src={currentPuzzle?.sheetSource}
            />
          </Zoom>
        </div>
        <div className="bg-gray-300 p-2 rounded-sm shadow-md">
          {renderGameEndMessage()}
          <GuessInput onSubmit={makeGuess} />
          {error && renderError()}
          {renderGuesses()}
        </div>
      </div>
    </div>
  );
}

export default App;
