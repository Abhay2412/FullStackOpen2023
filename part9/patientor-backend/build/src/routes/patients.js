"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = __importDefault(require("../utils"));
const router = express_1.default.Router();
router.get('/', (_request, response) => {
    response.send(patientService_1.default.getNoSsnPatient());
});
router.get('/:id', (request, response) => {
    response.send(patientService_1.default.getSinglePatient(request.params.id));
});
router.post('/', (request, response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    try {
        const newPatientToAdd = (0, utils_1.default)(request.body);
        const patientAdded = patientService_1.default.addingNewPatient(newPatientToAdd);
        response.json(patientAdded);
    }
    catch (error) {
        let errorMessage = 'Not able to add new patient.';
        if (error instanceof Error) {
            errorMessage += 'Error: ' + error.message;
        }
        response.status(400).send(errorMessage);
    }
});
exports.default = router;
