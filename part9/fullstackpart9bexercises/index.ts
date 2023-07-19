import express from 'express';
import { parseBmiArguments, calculateBmi } from './bmiCalculator';
import { parseExerciseArguments, calculateExercises } from './exerciseCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (request, response) => {
    const weight = request.query.weight;
    const height = request.query.height;
  
    if ( !height || !weight) {
      response.status(400);
      response.send({ error: 'malformatted parameters' });
    } 
    else {
      try {
        const { heightInCm, weightInKg } = parseBmiArguments(Number(height), Number(weight));
        const bmi = calculateBmi(heightInCm, weightInKg);
        response.send({
          weight: weightInKg,
          height: heightInCm,
          bmi: bmi
        });
      } catch (err) {
        response.status(400);
        response.send({ error: err.message });
      }
    }
  });

  app.post('/exercises', (request, response) => {
    const dailyExerciseHours = request.body.daily_exercises;
    const targetExercise = request.body.target;

    if(!dailyExerciseHours || !targetExercise) {
        response.status(400);
        response.send({ error: 'malformatted parameters' });
    }
    else {
        try {
            const { target, dailyExerciseTimes } = parseExerciseArguments(targetExercise, dailyExerciseHours);
            response.send(calculateExercises(target, dailyExerciseTimes));
        }
        catch (err) {
            response.status(400);
            response.send({ error: err.message });
        }
    }
  });

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});