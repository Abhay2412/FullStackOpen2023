/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import newPatient from "../utils/newPatient";
import newEntry from "../utils/newEntry";

const router = express.Router();

router.get('/', (_request, response) => {
    response.send(patientService.getPatient());
});

router.get('/:id', (request, response) => {
    response.send(patientService.getSinglePatient(request.params.id));
});

router.post('/', (request, response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    try {
        const newPatientToAdd = newPatient(request.body);
        const patientAdded = patientService.addingNewPatient(newPatientToAdd);
        response.json(patientAdded);
    }
    catch (error: unknown) {
        let errorMessage = 'Not able to add new patient.';
        if (error instanceof Error) {
            errorMessage += 'Error: ' + error.message;
        }
        response.status(400).send(errorMessage);
    }
});

router.post('/:id/entries', (request, response) => {
    try {
        const patient = patientService.getSinglePatient(request.params.id);
        if(patient === undefined) {
            response.status(404).send('Patient was not found');
            return;
        }
        const newEntryToAdd = newEntry(request.body);
        const entryAdded = patientService.addingNewEntry(patient, newEntryToAdd);
        response.json(entryAdded);
    }
    catch (error: unknown) {
        let errorMessage = 'Not able to add new patient.';
        if (error instanceof Error) {
            errorMessage += 'Error: ' + error.message;
        }
        response.status(400).send(errorMessage);
    }
});

export default router;