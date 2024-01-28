import axios from 'axios';

const baseURLs = {
    "dev": "http://127.0.0.1:8000/api/",
    "prod": "https://api.sheet-musicle.com/api/"
};

const baseURL = baseURLs[import.meta.env.PROD ? "prod" : "dev"];

type ComposerResponse = {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    bornYear: number;
    diedYear: number;
}

type WorkResponse = {
    id: number;
    workTitle: string;
    compositionYear: number;
    opus: string;
    opusNumber: number;
}

type DateRangeResponse = {
    min: number;
    max: number;
}

export const getComposers = async () => {
    const response = await axios.get(baseURL + "composers/");

    const responseData: Array<ComposerResponse> = response.data;
    return responseData;
};

export const getWorksByComposerId = async (composerId: number) => {
    const response = await axios.get(baseURL + "works/" + composerId);

    const responseData: Array<WorkResponse> = response.data;
    return responseData;
};

export const getComposerDateRange = async (composerId: number) => {
    const response = await axios.get(baseURL + "composers/" + composerId + "/range");

    const responseData: DateRangeResponse = response.data;
    return responseData;
};
