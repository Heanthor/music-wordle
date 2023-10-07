import worksByComposer from "./assets/parsed_composers.json";

export class ComposerWork {
  composer: string;
  work: string;
  compositionYear: number;
  opus: string | number;
  opusNumber: number | undefined;

  constructor(
    composer: string,
    work: string,
    compositionYear: number,
    opus: string | number,
    opusNumber?: number
  ) {
    this.composer = composer;
    this.work = work;
    this.compositionYear = compositionYear;
    this.opus = opus;
    this.opusNumber = opusNumber;
  }

  equals(other: ComposerWork): boolean {
    return (
      this.composer.toLowerCase() === other.composer.toLowerCase() &&
      this.matchWork(other.work)
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
          if (
            (t1.startsWith("k") || t1.startsWith("h")) &&
            t1.substring(1).match(/^\d+$/)
          ) {
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
    console.log(
      `Guess: ${guess}, Answer: ${this.work}, Score: ${score} (${numMatches}/${answerTokens.length})`
    );

    return score >= correctnessThreshold;
  }
}

export const getComposerWorkByID = (
  composerID: number,
  workID: number
): ComposerWork => {
  // TODO: brittle, just so happens the IDs the same order they are present in the document
  const composer = worksByComposer[composerID];
  const work = worksByComposer[composerID].works[workID];

  return new ComposerWork(
    composer.fullname,
    work.work_title,
    work.composition_year,
    work.opus,
    work.opus_number
  );
};


const careerLengthByComposer: {[composerName: string]: number} = {};

export const getYearRangesByComposerId = (): {[composerName: string]: number} => {
  if (Object.keys(careerLengthByComposer).length === 0) {
    for (const composer of worksByComposer) {
      const works = composer.works;
      const years = works.map((w) => w.composition_year);
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);

      careerLengthByComposer[composer.fullname] = maxYear - minYear;
    }
  }

  console.log(careerLengthByComposer);
  return careerLengthByComposer;
};
