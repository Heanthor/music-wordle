import axios from "axios";
import { ComposerWork } from "./composerWork";
import { DailyPuzzle, parseCategoryFromAbbreviation } from "./dailyPuzzle";

const baseURLs = {
  dev: "http://127.0.0.1:8000/api/",
  prod: "https://api.sheet-musicle.com/api/",
};

const baseURL = baseURLs[import.meta.env.PROD ? "prod" : "dev"];

export type ComposerResponse = {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  bornYear: number;
  diedYear: number;
};

export type WorkResponse = {
  id: number;
  workTitle: string;
  compositionYear: number;
  opus: string;
  opusNumber: number;
};

export type DateRangeResponse = {
  min: number;
  max: number;
};

export type LatestPuzzleResponse = {
  id: number;
  date: string;
  sheetImageUrl: string;
  sequenceNumber: number;
  isLatest: boolean;
  type: string;
  answer: WorkResponse & { composer: ComposerResponse };
};

export const getComposers = async () => {
  const response = await axios.get(baseURL + "composers/");

  const responseData: Array<ComposerResponse> = response.data.map(
    (e: {
      id: number;
      full_name: string;
      first_name: string;
      last_name: string;
      born_year: number | null;
      died_year: number | null;
    }) => {
      return {
        id: e.id,
        fullName: e.full_name,
        firstName: e.first_name,
        lastName: e.last_name,
        bornYear: e.born_year,
        diedYear: e.died_year,
      };
    }
  );
  return responseData;
};

export const getWorksByComposerId = async (composerId: number) => {
  const response = await axios.get(baseURL + "works/" + composerId);

  const responseData: Array<WorkResponse> = response.data.map(
    (e: {
      id: number;
      work_title: string;
      composition_year: number;
      opus: string;
      opus_number: number;
    }) => {
      return {
        id: e.id,
        workTitle: e.work_title,
        compositionYear: e.composition_year,
        opus: e.opus,
        opusNumber: e.opus_number,
      };
    }
  );
  return responseData;
};

export const getComposerDateRange = async (composerId: number) => {
  const response = await axios.get(
    baseURL + "composers/" + composerId + "/range"
  );

  const responseData: DateRangeResponse = response.data;
  return responseData;
};

export const getLatestPuzzle = async (category: string) => {
  const response = await axios.get(baseURL + "puzzles/" + category + "/latest");

  return parsePuzzleResponse(response);
};

export const getPuzzleBySequenceNumber = async (
  category: string,
  sequenceNumber: number
) => {
  const response = await axios.get(
    baseURL + "puzzles/" + category + "/" + sequenceNumber
  );

  return parsePuzzleResponse(response);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parsePuzzleResponse = (response: any): DailyPuzzle => {
  const responseData: LatestPuzzleResponse = {
    id: response.data.id,
    date: response.data.date,
    sheetImageUrl: response.data.sheet_image_url,
    sequenceNumber: response.data.sequence_number,
    isLatest: response.data.is_latest,
    type: response.data.type,
    answer: {
      id: response.data.answer.id,
      workTitle: response.data.answer.work_title,
      compositionYear: response.data.answer.composition_year,
      opus: response.data.answer.opus,
      opusNumber: response.data.answer.opus_number,
      composer: {
        id: response.data.answer.composer.id,
        fullName: response.data.answer.composer.full_name,
        firstName: response.data.answer.composer.first_name,
        lastName: response.data.answer.composer.last_name,
        bornYear: response.data.answer.composer.born_year,
        diedYear: response.data.answer.composer.died_year,
      },
    },
  };

  return asDailyPuzzle(responseData);
};

const asDailyPuzzle = (response: LatestPuzzleResponse) => {
  return new DailyPuzzle(
    new Date(response.date),
    response.sequenceNumber,
    response.isLatest,
    new ComposerWork(
      response.answer.composer.fullName,
      response.id,
      response.answer.workTitle,
      response.answer.compositionYear,
      response.answer.opus,
      response.answer.opusNumber
    ),
    response.sheetImageUrl,
    parseCategoryFromAbbreviation(response.type)
  );
};

export const asComposerWork = (
  response: WorkResponse,
  composer: ComposerResponse
) => {
  return new ComposerWork(
    composer.fullName,
    composer.id,
    response.workTitle,
    response.compositionYear,
    response.opus,
    response.opusNumber
  );
};
