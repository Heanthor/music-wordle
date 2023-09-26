import React, { useState } from "react";

function GuessInput({ onSubmit }: { onSubmit: (s: string) => void }) {
    const [currentGuess, setCurrentGuess] = useState("");
    return (
        <form
            className="mb-4 mt-2 md:mb-2 md:mt-0 flex justify-center"
            onSubmit={(e) => {
                if (e) {
                    e.preventDefault();
                }
                onSubmit(currentGuess);
                setCurrentGuess("");
            }}
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
                type="submit"
            >
                Guess!
            </button>
        </form>
    );
}

export default GuessInput;