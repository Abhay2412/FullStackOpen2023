import axios from "axios";
import { Patient, PatientFormValues, Entry, EntryWithoutId, HealthCheckEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
  return data;
};

const addingEntry = async(patientId: string, object: EntryWithoutId) => {
  const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${patientId}/entries`, object);
  return data;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, addingEntry };