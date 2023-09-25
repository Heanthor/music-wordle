import { useState, ReactNode, SyntheticEvent } from "react";
import music1 from "./assets/music-1.png";
import { ComposerWork, parseGuess } from "./composerWork";

function App() {
  const MAX_GUESSES = 5;

  const [guesses, setGuesses] = useState<ComposerWork[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");

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

  const renderGuesses = (): ReactNode => {
    const guessItems = guesses.map((guess, i) => {
      return (
        <div key={i} className="flex justify-center">
          {renderGuessNumber(i + 1)}
          {renderComposerCard(guess.composer)}
          {renderWorkCard(guess.work)}
        </div>
      );
    });

    for (let i = 0; i < MAX_GUESSES - guesses.length; i++) {
      // fill remainder with placeholders
      guessItems.push(
        <div key={i + guesses.length} className="flex justify-center">
          {renderGuessNumber(i + guesses.length + 1)}
          {renderPlaceholderCard()}
        </div>
      );
    }

    return guessItems;
  };

  const renderGuessNumber = (i: number): ReactNode => (
    <div className="bg-yellow-400 rounded-lg py-1 px-2 mr-2 my-1 text-blue-800 text-md font-semibold flex flex-col justify-center content-center">
      <span>{i}</span>
    </div>
  );

  const renderPlaceholderCard = (): ReactNode => (
    <>
      <div className="block max-w-[12rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-cyan-500 mr-2 flex-grow mb-2"></div>
      <div className="block max-w-[14rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-cyan-500 mr-2 flex-grow mb-2"></div>
    </>
  );

  const renderCardTitle = (text: string, correct: boolean = true): ReactNode => (
    <div className="flex justify-between">
      <span>{text}</span><span>{correct ? "✅" : "❌"}</span>
    </div>
  );

  const renderComposerCard = (text: string): ReactNode => {
    return (
      <div className="block max-w-[12rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-cyan-500 mr-2 flex-grow mb-2">
        <div className="p-2">
          <h5 className="mb-1 text-md font-medium leading-tight text-neutral-50">
            {renderCardTitle("Composer")}
          </h5>
          <p className="text-sm leading-normal text-neutral-50">{text}</p>
        </div>
      </div>
    );
  };

  const renderWorkCard = (text: string): ReactNode => {
    return (
      <div className="block max-w-[14rem] rounded-lg text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-indigo-500 flex-grow mb-2">
        <div className="p-2">
          <h5 className="mb-1 text-md font-medium leading-tight text-neutral-50">
            {renderCardTitle("Work")}
          </h5>
          <p className="text-sm leading-normal text-neutral-50">{text}</p>
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
