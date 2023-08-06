import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const baseURL = 'http://localhost:3001/api/diaries';

export const getAll = async () => {
    const res = await axios.get<DiaryEntry[]>(baseURL);
    return res.data;
}

export const createNewDiary = async (newDiaryObject: NewDiaryEntry) => {
    const res = await axios.post<DiaryEntry>(baseURL, newDiaryObject);
    return res.data
}
