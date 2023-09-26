import { useState, ReactNode } from "react";
import { ComposerWork, parseGuess } from "./composerWork";
import { puzzles } from "./dailyPuzzle";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import PlaceholderRow from "./components/PlaceholderRow";
import GuessInput from "./components/GuessInput";
import GuessRow from "./components/GuessRow";

function App() {
  const MAX_GUESSES = 5;

  const [guesses, setGuesses] = useState<ComposerWork[]>([]);
  const [error, setError] = useState("");

  const currentPuzzle = puzzles.slice(-1)[0];

  const makeGuess = (rawGuess: string) => {
    console.log("makeGuess");

    const guess = rawGuess.trim();
    if (guess.length === 0) {
      return;
    }

    const parsedGuess = parseGuess(guess);
    if (parsedGuess.composer === "invalid") {
      setErrorWithTimeout("invalidComposer");
      return;
    }

    if (parsedGuess.work === "invalid") {
      setErrorWithTimeout("invalidWork");
      return;
    }

    if (guesses.find((g) => g.equals(parsedGuess))) {
      setErrorWithTimeout("duplicateGuess");
      return;
    }

    setGuesses([...guesses, parsedGuess]);
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
      guessItems.push(
        <PlaceholderRow key={rowNumber} rowNumber={rowNumber} />
      );
    }

    return guessItems;
  };

  const renderError = (): ReactNode => {
    let errorText;
    switch (error) {
      case "duplicateGuess":
        errorText = "You've already guessed that!";
        break;
      case "invalidComposer":
        errorText =
          "Could not find a composer with that name, try another spelling?";
        break;
      case "invalidWork":
        errorText = "Could not find a work with that name.";
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

  return (
    <div className="min-h-screen bg-blue-900">
      <div className="container mx-auto text-center w-3/4">
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
          <GuessInput onSubmit={makeGuess} />
          {error && renderError()}
          {renderGuesses()}
        </div>
      </div>
    </div>
  );
}

export default App;
