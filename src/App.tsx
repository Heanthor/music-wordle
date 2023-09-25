import { useState, ReactNode, SyntheticEvent } from "react";
import { ComposerWork, parseGuess } from "./composerWork";
import { puzzles } from "./dailyPuzzle";

function App() {
  const MAX_GUESSES = 5;

  const [guesses, setGuesses] = useState<ComposerWork[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");

  const currentPuzzle = puzzles.slice(-1)[0];

  const makeGuess = (e: SyntheticEvent | undefined) => {
    if (e) {
      e.preventDefault();
    }

    const guess = currentGuess.trim();
    const parsedGuess = parseGuess(guess);
    console.log();

    if (guesses.find((g) => g === parsedGuess)) {
      alert("You already guessed that!");
      return;
    }
    setGuesses([...guesses, parsedGuess]);
    setCurrentGuess("");
  };

  const composerCorrect = (guess: ComposerWork): boolean => guess.composer === currentPuzzle?.puzzleAnswer.composer;
  const workCorrect = (guess: ComposerWork): boolean => guess.work === currentPuzzle?.puzzleAnswer.work;

  const renderGuesses = (): ReactNode => {
    const guessItems = guesses.map((guess, i) => {
      return (
        <div key={i} className="flex justify-center items-stretch mb-2">
          {renderGuessNumber(i + 1)}
          {renderAnswerCard("Composer", guess.composer, "cyan-500", 12, composerCorrect(guess))}
          {renderAnswerCard("Work", guess.composer, "indigo-500", 14, workCorrect(guess))}
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
      <div className="block max-w-[12rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-cyan-500 mr-2 flex-grow"></div>
      <div className="block max-w-[14rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-cyan-500 mr-2 flex-grow"></div>
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

  const renderAnswerCard = (title: string, text: string, backgroundClass: string, widthRem: number, correct: boolean): ReactNode => {
    return (
      <div className={`block max-w-[${widthRem}rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-${backgroundClass} mr-2 flex-grow`}>
        <div className="p-2">
          <h5 className="mb-1 text-md font-medium leading-tight text-neutral-50">
            {renderCardTitle(title, correct)}
          </h5>
          <p className="text-sm leading-normal text-neutral-100">{text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-900">
      <div className="container mx-auto text-center w-3/4">
        <h1 className="text-2xl text-neutral-50">
          Guess the composer and title of the following work:
        </h1>
        <div className="pb-4">
          <img
            className="mx-auto outline rounded-md"
            src={currentPuzzle?.sheetSource}
          />
        </div>
        <div className="bg-gray-300 p-2 rounded-sm shadow-sm">
          <form className="mb-2" onSubmit={(e) => makeGuess(e)}>
            <input
              className="mr-2 pl-1"
              type="text"
              id="guess-box"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
            />
            <button
              className="px-2 py-1 font-semibold text-sm bg-cyan-500 text-neutral-50 rounded-full shadow-sm"
              onClick={(e) => makeGuess(e)}
            >
              Guess
            </button>
          </form>

          {renderGuesses()}
        </div>
      </div>
    </div>
  );
}

export default App;
