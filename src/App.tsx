import { useState, ReactNode, SyntheticEvent } from "react";
import { ComposerWork, parseGuess } from "./composerWork";
import { puzzles } from "./dailyPuzzle";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function App() {
  const MAX_GUESSES = 5;

  const [guesses, setGuesses] = useState<ComposerWork[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [error, setError] = useState("");

  const currentPuzzle = puzzles.slice(-1)[0];

  const makeGuess = (e: SyntheticEvent | undefined) => {
    if (e) {
      e.preventDefault();
    }

    const guess = currentGuess.trim();
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
    setCurrentGuess("");
  };

  const setErrorWithTimeout = (text: string): void => {
    setError(text);
    setTimeout(() => setError(""), 2000);
  };

  const composerCorrect = (guess: ComposerWork): boolean =>
    guess.composer === currentPuzzle?.puzzleAnswer.composer;

  const renderGuesses = (): ReactNode => {
    const guessItems = guesses.map((guess, i) => {
      return (
        <div key={i} className="flex justify-center items-stretch mb-2">
          {renderGuessNumber(i + 1)}
          {renderAnswerCard(
            "Composer",
            guess.composer,
            "cyan-500",
            12,
            composerCorrect(guess)
          )}
          {renderAnswerCard(
            "Work",
            guess.work,
            "indigo-500",
            14,
            currentPuzzle?.puzzleAnswer.matchWork(guess.work)
          )}
        </div>
      );
    });

    for (let i = 0; i < MAX_GUESSES - guesses.length; i++) {
      // fill remainder with placeholders
      guessItems.push(
        <div key={i + guesses.length} className="flex justify-center mb-2">
          {renderGuessNumber(i + guesses.length + 1)}
          {renderPlaceholderCard()}
        </div>
      );
    }

    return guessItems;
  };

  const renderGuessNumber = (i: number): ReactNode => (
    <div className="bg-yellow-400 rounded-lg py-1 px-2 mr-2 text-blue-800 text-md font-semibold flex flex-col justify-center content-center">
      <span>{i}</span>
    </div>
  );

  const renderPlaceholderCard = (): ReactNode => (
    <>
      <div className="block max-w-[12rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-slate-400 mr-2 flex-grow"></div>
      <div className="block max-w-[14rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-slate-400 mr-2 flex-grow"></div>
    </>
  );

  const renderCardTitle = (
    text: string,
    correct: boolean = true
  ): ReactNode => (
    <div className="flex justify-between">
      <span>{text}</span>
      <span>{correct ? "✅" : "❌"}</span>
    </div>
  );

  const renderAnswerCard = (
    title: string,
    text: string,
    backgroundClass: string,
    widthRem: number,
    correct: boolean
  ): ReactNode => {
    return (
      <div
        className={`block max-w-[${widthRem}rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-${backgroundClass} mr-2 flex-grow`}
      >
        <div className="p-2">
          <h5 className="mb-1 text-md font-medium leading-tight text-neutral-50">
            {renderCardTitle(title, correct)}
          </h5>
          <p className="text-sm leading-normal text-neutral-100">{text}</p>
        </div>
      </div>
    );
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
          <form
            className="mb-4 mt-2 md:mb-2 md:mt-0 flex justify-center"
            onSubmit={(e) => makeGuess(e)}
          >
            <input
              className="mr-2 pl-1 shrink w-2/3 md:w-1/4"
              type="text"
              id="guess-box"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
            />
            <button
              className="px-2 py-1 font-semibold text-sm bg-cyan-500 text-neutral-50 rounded-full shadow-sm"
              onClick={(e) => makeGuess(e)}
            >
              Guess!
            </button>
          </form>

          {error && renderError()}
          {renderGuesses()}
        </div>
      </div>
    </div>
  );
}

export default App;
