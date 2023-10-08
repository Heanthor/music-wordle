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
      this.work === other.work &&
      this.compositionYear === other.compositionYear &&
      this.opus === other.opus &&
      this.opusNumber === other.opusNumber
    );
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

  return careerLengthByComposer;
};
