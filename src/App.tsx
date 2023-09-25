import { useState, ReactNode, SyntheticEvent } from "react";
import music1 from "./assets/music-1.png";
import ParsedGuess from "./parsedGuess";

function App() {
  const [guesses, setGuesses] = useState<ParsedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");

  const makeGuess = (e: SyntheticEvent | undefined) => {
    if (e) {
      e.preventDefault();
    }

    const guess = currentGuess.trim();
    const parsedGuess = new ParsedGuess(guess);
    console.log();

    if (guesses.find((g) => g === parsedGuess)) {
      alert("You already guessed that!");
      return;
    }
    setGuesses([...guesses, parsedGuess]);
  };

  const renderGuesses = (): ReactNode => {
    return guesses.map((guess, i) => {
      return (
        <div key={i} className="flex justify-center">
          <div className="bg-yellow-400 hover:bg-yellow-300 rounded-lg p-1 mr-2 my-1 text-blue-800 text-md font-semibold">
            <span>{i + 100}</span>
          </div>
          {renderComposerCard(guess.composer)}
          {renderWorkCard(guess.work)}
        </div>
      );
    });
  };

  const renderComposerCard = (text: string): ReactNode => {
    return (
      <div className="block max-w-[18rem] rounded-lg bg-white text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-cyan-500 mr-2">
        <div className="p-2">
          <h5 className="mb-1 text-md font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            Composer
          </h5>
          <p className="text-sm leading-normal text-neutral-600 dark:text-neutral-50">
            {text}
          </p>
        </div>
      </div>
    );
  };

  const renderWorkCard = (text: string): ReactNode => {
    return (
      <div className="block max-w-[18rem] rounded-lg bg-white text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-indigo-500">
        <div className="p-2">
          <h5 className="mb-1 text-md font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            Work
          </h5>
          <p className="text-sm leading-normal text-neutral-600 dark:text-neutral-50">
            {text}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container mx-auto text-center w-3/4">
        <h1 className="text-xl">
          Guess the composer and title of the following work:
        </h1>
        <div className="pb-4">
          <img className="mx-auto outline rounded-md" src={music1} />
        </div>
        <div className="bg-gray-300 p-2">
          <form className="mb-2" onSubmit={(e) => makeGuess(e)}>
            <input
              className="mr-2 pl-1"
              type="text"
              id="guess-box"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
            />
            <button
              className="px-2 py-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
              onClick={(e) => makeGuess(e)}
            >
              Guess
            </button>
          </form>

          {renderGuesses()}
        </div>
      </div>
    </>
  );
}

export default App;
