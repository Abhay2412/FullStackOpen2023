/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from "../utils";

const router = express.Router();

router.get('/', (_request, response) => {
    response.send(patientService.getNoSsnPatient());
});

router.post('/', (request, response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    try {
        const newPatientToAdd = toNewPatient(request.body);
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
export default router;