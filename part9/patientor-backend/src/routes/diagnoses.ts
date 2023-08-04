import express from "express";
import allDiagnoses from '../../data/diagnoses';

const router = express.Router();

router.get('/', (_request, response) => {
    response.send(allDiagnoses);
});

export default router;