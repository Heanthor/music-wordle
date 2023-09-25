import composers from "./assets/composers.json";

export class ComposerWork {
  composer: string;
  work: string;

  constructor(composer: string, work: string) {
    this.composer = composer;
    this.work = work;
  }

  equals(other: ComposerWork): boolean {
    return (
      this.composer.toLowerCase() === other.composer.toLowerCase() &&
      this.work.toLowerCase() === other.work.toLowerCase()
    );
  }

  matchWork(guess: string): boolean {
    // algorithm
    // match as many tokens as possible to the real work
    // ignore opus numbers such as "No." "Op." in both guess and answer
    // for catalog numbers, take either the raw number or prefixed with the identifier, like "K545"
    // if number of matching tokens is a high percentage of the answer, call it "good enough" and give credit
    const correctnessThreshold = 0.8;
    const processTokenList = (tokens: string[]): string[] =>
      tokens
        .map((t) => {
          const t1 = t.toLowerCase();

          // drop identifiers appended to a number
          if ((t1.startsWith("k") || t1.startsWith("h")) && t1.substring(1).match(/^\d+$/)) {
            return t1.substring(1);
          } else if (t1.startsWith("bwv")) {
            return t1.substring(3);
          }

          return t1;
        })
        .filter((t) => {
          const ignoredTokens = ["no", "op", "opus", "bwv", "k", "h"];
          const t1 = t.replace(".", "");

          return !ignoredTokens.includes(t1);
        });

    const tokens = processTokenList(guess.split(" "));
    const answerTokens = processTokenList(this.work.split(" "));

    let numMatches = 0;
    for (const token of tokens) {
      if (answerTokens.indexOf(token) >= 0) {
        numMatches++;
      }
    }

    const score = numMatches / answerTokens.length;
    console.log(`Guess: ${guess}, Answer: ${this.work}, Score: ${score} (${numMatches}/${answerTokens.length})`);

    return score >= correctnessThreshold;
  }
}

export const parseGuess = (guess: string): ComposerWork => {
  const tokens = guess.split(" ");

  // for each word in guess, try to find the composer, and the piece
  // if we find a composer, then the rest of the words are the title
  for (const token of tokens) {
    const composer = composers.find(
      (composer) => composer.toLowerCase().indexOf(token.toLowerCase()) >= 0
    );
    if (composer) {
      const work = tokens.slice(tokens.indexOf(token) + 1).join(" ");
      return { composer, work } as ComposerWork;
    }
  }

  return { composer: "invalid", work: "invalid" } as ComposerWork;
};
