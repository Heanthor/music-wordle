// import worksByComposer from "./assets/parsed_composers.json";

export class ComposerWork {
  composer: string;
  composerId: number;
  work: string;
  compositionYear: number;
  opus: string | number;
  opusNumber: number | undefined;

  constructor(
    composer: string,
    composerId: number,
    work: string,
    compositionYear: number,
    opus: string | number,
    opusNumber?: number
  ) {
    this.composer = composer;
    this.composerId = composerId;
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

