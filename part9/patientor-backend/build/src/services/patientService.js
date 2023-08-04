"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const getPatient = () => {
    return patients_1.default;
};
const getNoSsnPatient = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};
const addingNewPatient = (entry) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const id = (0, uuid_1.v1)();
    const newPatientAdd = Object.assign({ id }, entry);
    patients_1.default.push(newPatientAdd);
    return newPatientAdd;
};
exports.default = { getPatient, getNoSsnPatient, addingNewPatient };
