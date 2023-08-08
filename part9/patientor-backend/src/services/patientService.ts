/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import patientData from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { NoSsnPatient, Patient, NewPatient, EntryWithoutId, Entry } from '../types';

const getPatient = (): Patient[] => {
    return patientData;
};

const getNoSsnPatient = (): NoSsnPatient[] => {
    return patientData.map(({ id, name, dateOfBirth, gender, entries, occupation }) => ({
        id, 
        name, 
        dateOfBirth,
        gender,
        occupation,
        entries,
    }));
};

const getSinglePatient = (id: string): Patient | undefined => {
    return patientData.find(p => p.id === id);
};

const addingNewPatient = (entry: NewPatient): Patient => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const id = uuid();
    const newPatientAdd = { id, ...entry };
    patientData.push(newPatientAdd);
    return newPatientAdd;
};

const addingNewEntry = (patient: Patient, entry: EntryWithoutId): Entry => {
    const id = uuid();
    const newEntryAdd = { id, ...entry };
    patient.entries.push(newEntryAdd);
    return newEntryAdd;
};

export default { getPatient, getNoSsnPatient, addingNewPatient, addingNewEntry, getSinglePatient };