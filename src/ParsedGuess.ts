  
import composers from "./assets/composers.json";

export default class ParsedGuess {
    composer: string;
    work: string;

    constructor(guess: string) {
        const { composer, work } = parseGuess(guess);
        this.composer = composer;
        this.work = work;
    }

    equals(other: ParsedGuess): boolean {
        return this.composer.toLowerCase() === other.composer.toLowerCase() && this.work.toLowerCase() === other.work.toLowerCase();
    }
}

const parseGuess = (guess: string): ParsedGuess => {
    const tokens = guess.split(" ");

    // for each word in guess, try to find the composer, and the piece
    // if we find a composer, then the rest of the words are the title
    for (const token of tokens) {
      const composer = composers.find((composer) => composer.toLowerCase().indexOf(token.toLowerCase()) >= 0);
      if (composer) {
        const work = tokens.slice(tokens.indexOf(token) + 1).join(" ");
        return { composer, work } as ParsedGuess;
      }
    }

    return { composer: "invalid", work: "invalid" } as ParsedGuess;
  };