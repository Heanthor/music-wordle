  
import composers from "./assets/composers.json";

export default class ParsedGuess {
    composer: string;
    title: string;

    constructor(guess: string) {
        const { composer, title } = parseGuess(guess);
        this.composer = composer;
        this.title = title;
    }

    equals(other: ParsedGuess): boolean {
        return this.composer.toLowerCase() === other.composer.toLowerCase() && this.title.toLowerCase() === other.title.toLowerCase();
    }
}

const parseGuess = (guess: string): ParsedGuess => {
    const tokens = guess.split(" ");

    // for each word in guess, try to find the composer, and the piece
    // if we find a composer, then the rest of the words are the title
    for (const token of tokens) {
      const composer = composers.find((composer) => composer.toLowerCase().indexOf(token.toLowerCase()) >= 0);
      if (composer) {
        const title = tokens.slice(tokens.indexOf(token) + 1).join(" ");
        return { composer, title } as ParsedGuess;
      }
    }

    return { composer: "invalid", title: "invalid" } as ParsedGuess;
  };