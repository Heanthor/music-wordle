import axios from "axios";
import { ComposerWork } from "./composerWork";
import { DailyPuzzle } from "./dailyPuzzle";

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
  sheet_image_url: string;
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

  const responseData: Array<WorkResponse> = response.data;
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

  const responseData: LatestPuzzleResponse = response.data;
  return asDailyPuzzle(responseData);
};

const asDailyPuzzle = (response: LatestPuzzleResponse) => {
  return new DailyPuzzle(
    new Date(response.date),
    new ComposerWork(
      response.answer.composer.fullName,
      response.id,
      response.answer.workTitle,
      response.answer.compositionYear,
      response.answer.opus,
      response.answer.opusNumber
    ),
    response.sheet_image_url
  );
};
